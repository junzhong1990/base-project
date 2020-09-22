<template>
  <div class="area-mult-div">
    <el-input readonly v-model="checkedRegionName" @focus="areaShow = true" class="areaInput"></el-input>

    <div v-show="areaShow" class="area-select-div">
      <div class="select-div">
        <ul>
          <li v-for="(i, index) in stageArr" :key="i" :data-stage="i" :ref="'level' + i">
            第{{ i }}级
          </li>
        </ul>
      </div>
      <div class="tree-div">
        <el-tree
          ref="areaTreeMult"
          :default-checked-keys="defaultCheckedKeys"
          :data="options"
          show-checkbox
          node-key="id"
          @check-change="checkChange"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      // 获取父元素传过来的获取级联数据的接口           
      qryObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isInit: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        clickEvent: '',
        checkedRegionName: '',
        areaShow: false,
        optionsOfStage: {},
        options: [],
        stage: 1,
        stageArr: [],
        defaultCheckedKeys: [],       // 默认选中的节点 id
        firstCheckedKeys: [],       // 当前全部等级的第级一的默认选中的节点 id
        defaultCheckedName: [],       // 默认选中的节点 name
        allRegionOptions: [],         // 全部区域选项
        emitDataTimeout: null, 

        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    created() {
    },

    mounted() {
      // console.log('区域多选只可多选同一级 挂载上去了 初始化 ')
      this.dataBackFill();        // init 换成了 回填
      this.initSelect()
    },

    watch: {
      $route: {
          handler: function(val, oldVal){
          // console.log('区域多选只可多选同一级 路由切换')
            this.options = [];
            this.checkedRegionName = '';
            this.defaultCheckedKeys = [],       
            this.firstCheckedKeys = [],       
            this.defaultCheckedName = [],       
            this.allRegionOptions = [];

            this.dataBackFill();        // init 换成了 回填
          },
          deep: true
      }
    },

    methods: {

      // 初始化事件
      initSelect() {
        this.bindSelectEvent()
      },

      bindSelectEvent() {
        var all = document.querySelector('.select-div')
        all.addEventListener('click', (event) => {
          var target = event.target
          let targetStage = parseInt(target.dataset.stage)
          
          if ( this.stage !== targetStage && targetStage ) {
              // console.log('不一样', this.stage, target, targetStage)
              this.removeClassAll('selected')
              this.toggleClass(target, 'selected')
              if( (this.stageArr.length == 2 && targetStage == 1) || (this.stageArr.length == 1 && targetStage == 2) ) {
                  this.defaultCheckedKeys = this.firstCheckedKeys;
                  this.checkedRegionName = this.defaultCheckedName.join(',');
                  // console.log('重置区域默认名称', this.defaultCheckedName)
              } else {
                this.defaultCheckedKeys = [];
                this.checkedRegionName = ''
              }
              // console.log(this.checkedRegionName)
              this.stage = targetStage
              this.options = this.optionsOfStage['stage' + this.stage]

              // this.$emit('areaMultResult', [this.stage, ''])
              this.emitDefaultCheckedKeys();
          }
        })

        this.clickEvent = (event) => {
          // console.log(event)
          var target = event.target
          var areaDiv = document.querySelector('.area-mult-div')
          // console.log('target', areaDiv.contains(target))
          if ( !areaDiv.contains(target) ) {
            this.areaShow = false
          }
        }
        document.addEventListener('click', this.clickEvent)
      },


      toggleClass(element, className) {
        // console.log(element)
        if ( element.classList.contains(className) ) {
          element.classList.remove(className)
        } else {
          element.classList.add(className)
        }
      },


      removeClassAll(className) {
        var selector = '.' + className
        var elements = document.querySelectorAll(selector)
        for ( var i = 0; i < elements.length; i++ ) {
          var e = elements[i]
          e.classList.remove(className)
        }
      },

      // 选择区域     default-checked-keys
      checkChange(obj, checked, child) {
        let allChecked = this.$refs.areaTreeMult.getCheckedNodes(true)
        this.checkedRegionName = allChecked.map( node => node.label).join(',')
        let checkedKeys = this.$refs.areaTreeMult.getCheckedKeys(true).join(',')
        this.$emit('areaMultResult', [this.stage, checkedKeys])
        // console.log('checkedRegionName', this.checkedRegionName)
      },

      // 初始化数据   this.init(backParam.RegionLevel, backParam.RegionList)
      async init( RegionLevel, RegionList ) {
        var tempArr = []
        /*
        * 考虑优化点（暂）
        * 有些级联需要缓存数据避免每次都要服务器请求
        * */
        if( Object.keys(this.qryObj).length === 0 ) {
          return
        }
        // console.log(this.qryObj)
        let data = this.qryObj.content
        var res = await this.$api[this.qryObj.apiCode]({data})
        if( res && res.code == 0 ) {
          let resData = res.data
          if (res.data[0].regionId == -999) {
            resData = res.data[0].children
          }
          this.options = []
          let k = []
          this.rebuildData(resData, k)
          // console.log(resData,k)
          tempArr = JSON.parse(JSON.stringify(k))
        }
        let level = res.data[0].regionLevel
        this.stage = level

        if ( level == 1 ) {
          this.stageArr = [1, 2]
          // stage 是1的数据源
          let arr1 = JSON.parse(JSON.stringify(tempArr))
          // console.log(tempArr)
          this.firstCheckedKeys = [];
          this.defaultCheckedName= [];
          arr1.forEach(v => {
            v.children = ''
            this.firstCheckedKeys.push(v.id)
            this.defaultCheckedName.push(v.label)
          })
          this.optionsOfStage.stage1 = arr1

          // stage 是3 的数据源
          this.optionsOfStage.stage2 = tempArr
        } else {
          // console.log(level)
          this.stageArr = [2]
          this.optionsOfStage.stage2 = tempArr
        }

        this.setDefaultChecked(RegionLevel, RegionList);
      },


      // 把数据处理成渲染的数据
      rebuildData(data, arr) {
        data.forEach((val, i) => {
          arr.push({
            value: val.regionId,
            label: val.regionName,
            // id: val.code           // 原有写法，code 为中文会存在重复的情况；
            id: val.regionId
          })
          this.allRegionOptions.push({id: val.regionId, name: val.regionName})
          this.firstCheckedKeys.push(val.regionId)
          this.defaultCheckedName.push(val.regionName)
          if ( val.children !== undefined ) {
            arr[i].children = []
            this.rebuildData(val.children, arr[i].children)
          }
        })
      },

      // 设置默认选项
      setDefaultChecked(RegionLevel, RegionList) {
        // console.log(RegionLevel, RegionList)
        let that = this;
        this.stage = RegionLevel ? RegionLevel : this.stage;
        let checkedKeys = RegionList ? RegionList : this.firstCheckedKeys;
        // console.log('stage' + this.stage)
        this.options = this.optionsOfStage['stage' + this.stage];
        // console.log(this.stage, checkedKeys, this.options)
        let backRegionName = this.defaultCheckedName;
        if( RegionList ) {
          // console.log(this.allRegionOptions)
          let nameArr = [];
          this.allRegionOptions.forEach(option => {
            if( RegionList.includes(option.id.toString()) ) {
              // console.log(option.name)
              nameArr.push(option.name);
            }
          })
          backRegionName = nameArr;
          // console.log(backRegionName)
        }

        this.defaultCheckedKeys = checkedKeys;
        this.checkedRegionName = backRegionName.join(',');
        // console.log(this.defaultCheckedKeys, this.checkedRegionName)

        this.$nextTick(() => {
          this.emitDataTimeout = setTimeout(() => {
            let allRefs = that.$refs;
            let selectorLi = `level${this.stage}`
          // console.log(allRefs.level0[0]);
            if( allRefs && allRefs[selectorLi] && allRefs[selectorLi][0] ) {
              that.removeClassAll('selected');
              that.toggleClass(allRefs[selectorLi][0], 'selected');
              // console.log(allRefs.level0[0]);
              that.emitDefaultCheckedKeys();
            }
          }, 500)          
        })
      },

      emitDefaultCheckedKeys() {
          let dCheckedKeys =  this.defaultCheckedKeys.join(',')
          this.$emit('areaMultResult', [this.stage, dCheckedKeys])
      },
      
      dataBackFill() {
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        // console.log('缓存的数据', this.dssResourceCode, backParam);
        if( backParam.hasOwnProperty('RegionLevel') &&  backParam.hasOwnProperty('RegionList') && backParam.RegionList != -999 ) {
            let RegionList = backParam.RegionList.split(',');
            // console.log('回填初始化')
            this.init(backParam.RegionLevel, RegionList)
        } else {
            // console.log('普通初始化')
            this.init();
        }
      },
    },

    beforeDestroy() {
      document.removeEventListener('click', this.clickEvent);
      clearTimeout(this.emitDataTimeout );
    },
  }
</script>

<style lang="less">
  .area-mult-div {
    width: 100%;
    position: relative;
    .areaInput {
        .el-input__inner {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
    }
    .area-select-div {
      display: flex;
      justify-content: flex-start;
      width: 300px;
      z-index: 100;
      position: absolute;
    }
    .select-div {
      border: 1px solid #E4E7ED;
      border-radius: 4px;
      background-color: #FFF;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-sizing: border-box;
      margin: 5px 0;
      ul {
        li {
          font-size: 14px;
          padding: 0 20px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #606266;
          height: 34px;
          line-height: 34px;
          box-sizing: border-box;
          cursor: pointer;
        }
        li.selected {
          color: #567CDB;
          font-weight: 700;
        }
        li:hover {
          background-color: #F5F7FA;
        }
      }
    }
    .tree-div {
      border: 1px solid #E4E7ED;
      border-radius: 4px;
      background-color: #FFF;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-sizing: border-box;
      margin: 5px 2px;
      padding-top: 5px;
      height: 230px;
      width: 200px;
      .el-tree {
        height: 220px;
        overflow: auto;
      }
    }
  }
</style>
