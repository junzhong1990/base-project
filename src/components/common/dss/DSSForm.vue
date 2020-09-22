<template>
  <div>
    <!--统计查询的查询表单-->
    <!-- <el-button type="ghost" @click="isCollapse=!isCollapse" icon="el-icon-search" id="query">
      <span>查询</span>
    </el-button> -->

<!-- v-show="isCollapse" -->
    <el-card class="mb12 dss-card" shadow="never" >
      <el-form class="form-inline" 
              v-show="isShowQueryCriteria"
              :inline="formLine" 
              ref="searchForm" 
              :model="searchForm" 
              :label-width="labelWidth"
              :rules="rules">
              
      <!-- 原数据 selectLinkage联动表单由于有两个 el-form-item 嵌套在 el-form-content 里面，外层的 label 不显示，同时要加上linkage-form-item样式-->
       <!-- <div v-for="(itemG, indexG) in formData" :key="indexG">
         <h2 class="title" v-if="itemG.groupName">{{itemG.groupName}}</h2>
         <el-form-item  v-for="(item, index) in itemG.actDeModelFormList"
                        :value="item.value"
                        :key="index"
                        :prop="item.attrName"
                        :label="['selectLinkage', 'radioLinkage', 'DoubleSelect'].includes(item.type) ? '' : item.label"
                        :class="{ 'full-line': item.type=='selectLinkage' || item.type=='radioLinkage'
                       || item.type=='checkBoxAll' || item.type=='radioGroup',
                        'linkage-form-item': item.type=='selectLinkage' || item.type=='radioLinkage'}">
           <form-set :item="item" :isInit="isInit" @formSetValueReturn="(val) => formDataSet(item, val)"></form-set>
         </el-form-item >
       </div> -->

        <!-- 改版数据 -->
         <!-- <h2 class="title" v-if="searchBarFormData.groupName">{{searchBarFormData.groupName}}</h2> -->
         <el-form-item  v-for="(item, index) in searchBarFormData.actDeModelFormList"
                        :value="item.value"
                        :key="index"
                        :prop="item.attrName"
                        :label="['selectLinkage', 'radioLinkage', 'DoubleSelect'].includes(item.type) ? '' : item.label"
                        :class="{ 'full-line': item.type=='selectLinkage' || item.type=='radioLinkage'
                       || item.type=='checkBoxAll' || item.type=='radioGroup',
                        'linkage-form-item': item.type=='selectLinkage' || item.type=='radioLinkage'}">
            <form-set :item="item" :isInit="isInit" @formSetValueReturn="(val) => formDataSet(item, val)"></form-set>
         </el-form-item >

        <el-form-item label=' ' class="full-line">
          <!-- 列表查询组件 -->
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item >
      </el-form> 

      <!-- 隐藏查询条件开关 -->
      <div class="showHideSearch" @click="isShowQueryCriteria = !isShowQueryCriteria">
        <p class="highLightP">
          <i :class="isShowQueryCriteria ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </p>
      </div>

      <!-- 工具栏 toolBarFormData -->
      <div class="toolBarDiv toolBarBackground" v-if="toolBarFormData.actDeModelFormList && toolBarFormData.actDeModelFormList.length > 0">
        <el-form class="toolBarForm" 
                ref="toolBarForm" 
                :model="searchForm" 
                :rules="rules">
            <el-form-item  v-for="(item, index) in toolBarFormData.actDeModelFormList"
                            :value="item.value"
                            :key="index"
                            :prop="item.attrName"
                            :label="item.label + ' :'">
                <tool-bar :item="item" :isInit="isInit" @formSetValueReturn="(val, type) => formDataSet(item, val, type)"></tool-bar>
            </el-form-item >
        </el-form>
        <div class="fillDiv toolBarBackground"></div>    
      </div>


    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import FormSet from '@/components/common/dss/FormSet'
  import toolBar from '@/components/common/dss/toolBar'
  import { mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'DSSForm',
    components: {
      FormSet,
      toolBar
    },
    props: {
      labelWidth: {
        type: String,
        default: '120px'
      },
      formData: {
        type: Array,
        default: function () {
          return []
        }
      },


      formLine: {
        type: Boolean,
        default: true
      },
      rules: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isInit: {
        type: String,
        default: ''
      },

    },

    data() {
      return {
        isCollapse: false,
        // loading: false,
        // checkboxList: [],      // 导出数组
        // options: [],           // 存放查询数组
        searchForm: {},           // 查询参数
        confirmSearch: {},        // 最终查询参数
        checkFormData: [],        // 非空校验参数
        formDataArr: [],          // 全部查询表单和工具表单的原始查询条件数据
        searchBarFormData: [],    // 查询表单的原始查询条件数据
        toolBarFormData: [],      // 工具表单的原始查询条件数据 
        isShowQueryCriteria: true,   // 是否展示查询条件
      }
    },

    created() {
    },

    mounted() {
        this.SET_DSSPAGEPARAM({})
    },

    watch: {
      $route: {
        handler: function(newVal, oldVal){
          this.SET_DSSPAGEPARAM({});
          console.log('dssForm 切换页面', this.dssPageParam)
          this.searchForm = {};
          this.confirmSearch = {};
        },
        deep: true
      },

      formData: {
        handler(newVal) {
          // console.log(newVal)
          if( newVal && newVal.length > 0 ) {
            let hasSearchBar = newVal.find(value => value.groupName === "查询条件");
            this.searchBarFormData = hasSearchBar ? hasSearchBar : [];
            // console.log(this.searchBarFormData)
            let hasToolBar = newVal.find(value => value.groupName === "工具栏");
            this.toolBarFormData = hasToolBar ? hasToolBar : [];
            // this.toolBarFormData.actDeModelFormList.forEach(value => {value[0].options[0] = '获取全部查询表单和工具表单的原始查询条件数据'})
            // console.log(this.searchBarFormData, this.toolBarFormData)    

            // 获取全部查询表单和工具表单的原始查询条件数据
            let formDataArr = [];
            let newFormData = JSON.parse(JSON.stringify(newVal));
            newFormData.forEach( formDataVal => {
              formDataArr = formDataArr == [] ? [...formDataVal.actDeModelFormList ] : formDataArr.concat([...formDataVal.actDeModelFormList ])
            })
            this.checkFormData = [];
            this.formDataArr = formDataArr;
            this.getFormDataAttr(formDataArr)
            // console.log(formDataArr)
            // console.log('我  formData 更新了 ', this.formData)
          }
        },
        deep: true
      },
    },

    computed: {
      ...mapGetters(['dssPageParam', 'dssResourceCode']),
    },

    methods: {
      // 设置表单回填数据
      ...mapMutations(['SET_DSSPAGEPARAM']),

      // 自定义全部查询表单和工具表单的查询条件，形成最终校验数据；
      getFormDataAttr(formData, fatherAttr) {
        // console.log('原表单数据', formData);
        let formDataArr = JSON.parse(JSON.stringify(formData));
        if( formDataArr && formDataArr.length > 0 ) {
          formDataArr.forEach( attrValue => {
            // console.log(attrValue)
              if( attrValue.attrName.indexOf(',') != -1 ) {
                attrValue.attrName = attrValue.attrName.split(',');
                attrValue.attrName.forEach( attrSplitVal => {
                  let obj = { attrName: attrSplitVal, label: attrValue.label };
                  // attrValue.firstValue || attrValue.firstValue === 0 ? obj.firstValue = attrValue.firstValue : '';
                  fatherAttr ?  obj[fatherAttr] = attrValue.firstValue : '';
                  this.checkFormData.push(obj)
                })
                //  "selectLinkage" || 'radioLinkage' 多级联动，每个子选项添加父类的属性和对应值
              } else if ( attrValue.type == "selectLinkage" || attrValue.type == 'radioLinkage' ) {
                // console.log(attrValue.options, attrValue)
                this.getFormDataAttr(attrValue.options, attrValue.attrName)

              } else {
                let obj = { attrName: attrValue.attrName, label: attrValue.label };
                // attrValue.firstValue || attrValue.firstValue === 0 ? obj.firstValue = attrValue.firstValue : '';
                fatherAttr ?  obj[fatherAttr] = attrValue.firstValue : '';
                this.checkFormData.push(obj)
              }
          })
        }

        // console.log('this.checkFormData', this.checkFormData)
      },

      // 校验全部查询表单和工具表单的查询条件是否存在为空情况；
      checkForm() {
        let confirmSearchKeys = Object.keys(this.confirmSearch);
        let isHasRegionFlag = this.confirmSearch.hasOwnProperty('RegionFlag');
        let isHasType = this.confirmSearch.hasOwnProperty('type');
        let regionFlagFirstValue = isHasRegionFlag ? this.confirmSearch.RegionFlag : '';
        let typeFirstValue = isHasType ? this.confirmSearch.type : '';
        // console.log(regionFlagFirstValue, typeFirstValue)

        if( isHasRegionFlag || isHasType ) {
          let newCheckFormData = [];
          this.checkFormData = [];
          this.getFormDataAttr(this.formDataArr);
          this.checkFormData.forEach(value => {
            if( (regionFlagFirstValue || regionFlagFirstValue === 0) && (!value.hasOwnProperty('RegionFlag') || value.RegionFlag == regionFlagFirstValue) ) {
              newCheckFormData.push(value);
            }
            if( (typeFirstValue || typeFirstValue === 0) && (!value.hasOwnProperty('type') || value.type == typeFirstValue) ) {
              if( value.type == typeFirstValue ) {
                // console.log(value)
                this.confirmSearch.RegionOrStationId = this.confirmSearch[value.attrName]
              }
              newCheckFormData.push(value);
            }
          })
          this.checkFormData = newCheckFormData;
        }

        // console.log(this.checkFormData)
        // console.log(confirmSearchKeys)
        // console.log(JSON.parse(JSON.stringify(this.confirmSearch)))

        let missingParameter = this.checkFormData.find(value => {
          return !confirmSearchKeys.includes(value.attrName) || (!this.confirmSearch[value.attrName] && this.confirmSearch[value.attrName] !== 0) 
        });


        if( missingParameter ) {
          this.$message({
            type: 'warning',
            message: `${missingParameter.label}不能为空`
          })
        } else  {
          // 特殊参数处理
          if( this.confirmSearch.hasOwnProperty('RegionOrStationId') ) {
            delete this.confirmSearch.Region
            delete this.confirmSearch.StationId
          } else if ( this.confirmSearch.hasOwnProperty('SchemeName') ) {
            delete this.confirmSearch.SchemeName
          }
        }

        // console.log('搜索欠缺的参数', missingParameter)
        // console.log('搜索表单参数', this.confirmSearch);
        // console.log('原全部表单参数', this.checkFormData)
        return missingParameter

      },

      formDataSet(item, val, type) {
        // 此处拿到的值有可能是数据，根据类型作修改，attrName有些是两个值，是用,分开
        Object.assign(this.searchForm, val);
        // console.log('DssForm里面设置值this.searchForm', this.searchForm, val, type);

        this.SET_DSSPAGEPARAM(this.searchForm);
        // console.log('this.searchForm', this.searchForm, val)
        // console.log('this.dssPageParam', this.dssPageParam)

        type == 'toolBar' ? this.search() : ''
      },

      search() {
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        // console.log('confirmSearch', this.confirmSearch)
        this.checkForm() ? '' : this.$emit('getConfirmSearch', this.confirmSearch)
      },

      

    },
  }
</script>

<style lang="scss">

  .el-card {
    border: none;
  }

  .el-card__body {
    // padding-bottom: 0;
    padding: 0;
     .el-form-item {
       margin-bottom: 8px;
     }
  }

  .toolBarDiv {
      // background: #fafafa;
      // margin-left: -20px;
      position: relative;
    .fillDiv {
        position: absolute;
        // background: #fafafa;
        border-top: 1px solid #a4b7d8;
        height: 60px;
        width: 20px;
        right: -20px;
        top: -1px;
    }
    .toolBarForm {
        display: flex;
        justify-content: flex-start;
      .el-form-item {
          width: auto;
          // min-width: 124px;
          // max-width: 154px;
          display: flex;
          justify-self: flex-start;
          margin-right: 20px;
          margin-bottom: 0;
          // padding: 10px 0;
        .el-form-item__label {
            display: inline-block;
        }
        .el-form-item__content {
            width: auto;
        }
      }
    }
  }

  .toolBarBackground {
      background-color: #dee7f2;
      // border-bottom: 1px solid #a4b7d8;
      border-top: 1px solid #a4b7d8;
  }

  .showHideSearch {
    height: 10px;
    background: #0072c6;

    color: #fff;
    line-height: 10px;
    display: flex;
    flex-basis: row;
    justify-content: center;
    .highLightP {
      width: 100px;
      height: 100%;
      background: rgba(#fff, 0.4);
      // position: relative;
      text-align: center;
      i {
        margin-top: -2px;
        // position: absolute;
        // top: -2px;
        // left: 50%;
        // line-height: -6px  !important;;
      }
    }
  }

</style>
