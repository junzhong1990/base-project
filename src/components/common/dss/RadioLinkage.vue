<!--
[{"label":"区域","firstValue":1,"attrName":"RegionOrStationId","value":"","type":"select","labelFirst":"区域","sourceData":"/api/v1/dss/paramScopeApi/getGameScope","source":"url"},{"label":"站点编号","firstValue":2,"attrName":"RegionOrStationId","value":"","type":"input","labelFirst":"站点编号"}]
-->
<template>
  <div class="radio-linkage-div">
    <el-radio-group v-model="firstStageValue">
      <!-- @change="changeFirstStageValue(index)"    因为影响回填后的样式所以注释掉 -->
      <el-radio
        v-for="(radioItem, index) in linkageObject.sub"
        :label="radioItem.firstValue"
        :key="index"
        class="radio-div"
      >
        <span :ref="'radioGroupName'+index">{{ radioItem.labelFirst }}:</span>
        <form-set
          :item="radioItem"
          :isInit="isInit"
          @formSetValueReturn="(val) => formDataSet(radioItem, val)"
        ></form-set>
      </el-radio>
    </el-radio-group>
  </div>
</template>


<script type="text/ecmascript-6">
import ajax from '@/utils/ajax.js'
import { dssURL } from '@/api/baseConfig'
import { mapGetters } from 'vuex'

export default {
  name: 'SelectLinkage',
  components: {},

  props: {
    linkageObject: {
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
      firstStageValue: '', // 联动的第一级的值
      item: {}, // 联动第二个组件的数据
      firstStageValueClone: '',
      allfirstStageValue: []
    }
  },

  created() {},

  mounted() {
    // console.log('RadioLinkage 初始化', this.linkageObject)
    this.initData()
  },

  computed: {
    ...mapGetters(['dssResourceCode'])
  },

  watch: {
    firstStageValue(newVal, oldVal) {
      // console.log(Object.prototype.toString.call(newVal) == '[object Array]', newVal, oldVal)
      // console.log(this.linkageObject.sub.find(subItem => subItem.type == "areaMixtureRadio"))
      // // 如果是 el-radio 组件 和 el-cascader 组件做联动时取  firstStageValue 值时两个组件会互相影响；
      if (
        Object.prototype.toString.call(newVal) == '[object Array]' &&
        this.linkageObject.sub.find(
          (subItem) => subItem.type == 'areaMixtureRadio'
        )
      ) {
        return
      }

      // console.log('firstStageValue变化', newVal)
      this.item = this.linkageObject.sub.find((subItem) => {
        return subItem.firstValue === newVal
      })

      this.firstStageValueClone = newVal
      this.formDataSet({}, {})
    },

    linkageObject: {
      handler(newValue, oldValue) {
        // console.log('RadioLinkage item 变化')
        if (newValue) {
          this.initData()
        }
      },
      deep: true
    }
  },

  methods: {
    initData() {
      if (this.linkageObject.sub.length > 0) {
        this.fillData()
        // this.firstStageValue = this.linkageObject.sub[0].firstValue;
        // this.firstStageValueClone = this.firstStageValue;
        this.linkageObject.sub.forEach(async (valItem) => {
          this.allfirstStageValue.push(valItem.firstValue)
          if (valItem.source == 'url') {
            // 从接口获取
            let resData = await ajax.get(valItem.sourceData, {
              baseURL: dssURL
            })
            if (resData.code == '0' && resData.data) {
              // valItem.options = resData.data
              this.$set(valItem, 'options', resData.data)
            } else {
              valItem.options = []
            }
          }
        })
      }
    },

    // 设置默认值或回填
    fillData() {
      let backParam = this.dssResourceCode.param
        ? JSON.parse(this.dssResourceCode.param)
        : {}
      // console.log('缓存的数据', this.dssResourceCode, backParam);
      // console.log(backParam[this.linkageObject.attrName], this.linkageObject.attrName)
      if (backParam.hasOwnProperty(this.linkageObject.attrName)) {
        // console.log('回填初始化')
        this.firstStageValue = backParam[this.linkageObject.attrName]
      } else {
        // console.log('普通初始化')
        this.firstStageValue = this.linkageObject.sub[0].firstValue
      }
      // console.log('this.firstStageValue', this.firstStageValue)

      this.firstStageValueClone = this.firstStageValue
      this.formDataSet({}, {})
    },

    formDataSet(item, val) {
      // console.log('linkage-div值回传设置', item, val)
      let form = {}
      Object.assign(form, val)
      form[this.linkageObject.attrName] = this.firstStageValueClone
      // console.log(form)
      this.$emit('linkageValueGet', form)
    }

    // 这是用于单选择区域选项时手动添加圆圈高亮、灰显的，为了不影响顶层单选框的样式；
    // changeFirstStageValue(index) {
    //   if( this.linkageObject.sub.find(subItem => subItem.type == "areaMixtureRadio") ) {
    //       let a = this.$refs;
    //         // console.log(a)
    //         // console.log(index)
    //       let radioGroupName = 'radioGroupName'+index;

    //       this.linkageObject.sub.forEach((item, index) => {
    //         let radioGroupName = 'radioGroupName'+index;
    //         a[radioGroupName][0].style.color='black'
    //         a[radioGroupName][0].parentNode.previousElementSibling.children[0].style.background = 'none';
    //       })

    //       a[radioGroupName][0].style.color='#567CDB'
    //       // console.log(a[radioGroupName][0].parentNode.previousElementSibling.children[0].style.background)
    //       a[radioGroupName][0].parentNode.previousElementSibling.children[0].style.background = '#567CDB';
    //   }
    // }
  }
}
</script>

<style lang="less">
.radio-linkage-div {
  margin-left: 120px;
  .el-form-item__content {
    width: 60% !important;
  }
  label {
    margin: 10px;
  }
  /*.el-radio__label {*/
  /*  display: flex;*/
  /*  justify-content: flex-start;*/
  /*}*/
}
</style>
