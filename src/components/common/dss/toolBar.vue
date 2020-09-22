<template>
    <div class="toolBar">
        <div v-if="item.type=='select'">
            <el-select placeholder="请选择" 
                        v-model="selectValue"
                        @change="(val) => formDataBackDssForm(item, val)">
                <el-option v-for="items in item.options" 
                        :value="items.value" 
                        :key="items.value"
                        :label="(items.label || items.text)">
                </el-option>
            </el-select>
        </div>


        <div v-if="item.type=='selectMult'" class="selectMult">
            <el-select placeholder="" 
                        v-model="selectMultiValue"
                        multiple
                        ref="selectMult"
                      >
                        <!-- @change="(val) => formDataBackDssForm(item, val)" -->
                <el-option v-for="items in item.options" 
                        :value="items.value" 
                        :key="items.value"
                        :label="(items.label || items.text)">
                </el-option>
                <div class="multipleChoice" @click="formDataBackDssForm(item, selectMultiValue)">确定</div>
                <div class="fillDiv"></div>
            </el-select>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'toolBar',
    components: {
    },

    props: {
      item: {
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
        selectValue: '',
        selectMultiValue: [],
      }
    },

    created() {
    },

    mounted() {
      // console.log('toolBar 挂载上去 了')
      this.getToolBarChooseOne();
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },


    watch: {
      item: {
        handler(newValue, oldValue) {
          // console.log('item 变化', newValue)
          this.getToolBarChooseOne();
        },
        deep: true
      },
    },
    
    methods: {
      // 获取工具栏各个下拉框默认参数
      getToolBarChooseOne() {
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        let form = {};
        let chooseValue
        let selectMultiVal
        // console.log('缓存的数据', this.dssResourceCode, backParam);

        if( backParam.hasOwnProperty(this.item.attrName) ) {
          // console.log('回填初始化');
           chooseValue =  backParam[this.item.attrName];
        } else if ( this.item.options && this.item.options.length > 0 ) {
          // console.log('普通初始化');
           chooseValue = this.item.options[0].value;
        }

          selectMultiVal = chooseValue.toString().split(',');
          selectMultiVal[ selectMultiVal.length - 1 ] == '' ? selectMultiVal.pop() : selectMultiVal;
           
           this.item.type == 'select' ? this.selectValue = chooseValue : this.selectMultiValue = selectMultiVal;
           form[this.item.attrName] = this.item.type == 'selectMult' && selectMultiVal.length == 1 ? selectMultiVal.join(',') + ',' : chooseValue;

        // console.log('工具栏选项', form, this.selectValue, this.selectMultiValue)
        this.$emit('formSetValueReturn', form)
      },

      formDataBackDssForm(item, val, event) {
        // console.log('formset 里面的 item', item)
        // console.log('formset 里面的 val', val)

        if( this.$refs && this.$refs.selectMult )  this.$refs.selectMult.blur();


        let form = {};
        let addParameters = false;
        if (Object.prototype.toString.call(val) == '[object Object]') {
          // console.log(form, val)
          form = val
        } else {
          if (item.type === 'selectMult') {
            // console.log('item.type',item.type)
            form[this.item.attrName] = val ? val.join(',') + ',' : val;
            // form[this.item.attrName] = val ? val.join('') : val;
            // || item.type === 'month'
          } else if (item.type === 'areaMultiple' || item.type === 'dateRangeFast' || item.type === 'daterange' || item.type === 'inputRange') {
            // console.log('item.type',item.type)
            let firstProp = this.item.attrName.split(',') [0];
            let secondProp = this.item.attrName.split(',') [1];
            form[firstProp] = val && val.length > 0 ? val[0] : val;
            form[secondProp] = val && val.length > 0 ? val[1] : val;
            item.type === 'areaMultiple' ? addParameters = true : addParameters = false;
          } else if (item.type === 'areaMixtureRadio') {
            // console.log('item.type',item.type)
            form[this.item.attrName] = val ? val.pop() : val;
          } else {
            // console.log('item.type',item.type)
            form[this.item.attrName] =  val;
          }
        }

        // console.log('form', form)
        this.$emit('formSetValueReturn', form, 'toolBar')
      },

      
    }
}
</script>

<style lang="scss">
 .toolBar {
    display: flex;
    justify-content: flex-start;
    .el-select {
        .el-input {
            // background: #fafafa;
            .el-input__inner {
                background-color: #dee7f2;
                border-top: 1px solid #a4b7d8;
                border: 1px solid transparent;
                padding-left: 0;
                padding-right: 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: auto;
                max-width: 100px;
            }
            .el-input__suffix {
                right: 0;
                .el-input__icon {
                    width: auto;
                }
            }
        }
    }

    .selectMult {
        width: 15px;
        position: relative;
        .el-input { 
            width: 15px;
            .el-input__inner {
                width: 15px;
                padding-right: 0;
            }
            .el-input__suffix {
                right: -5px;
            }
        }
        .el-select {
            .el-select__tags {
                .el-tag--info {
                    display: none;
                }
            }
        }
    }
  }

  .multipleChoice {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: skyblue;
    text-align: center;
    border-radius: 20px;
    font-size: 14px;
    color: #fff;
  }

  .multipleChoice:hover {
    cursor: pointer;
    background: orange !important;
  }

  
  .fillDiv {
    height: 36px;
  }  

  .el-select-dropdown {
    .el-select-dropdown__list {
      // padding-bottom: 36px;
      .el-select-dropdown__item {
        padding: 0 30px;
      }
    }
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    right: 10px;
  }

</style>