<template>
<div>
  <!-- 数据分类 -->
  <XForm
    :classifications="classifications" // 分类对象
    :base="base" // 第一类
    :userdata="userdata" // 第二类
    :other="other" // 第三类
    :activeHide="activeHide"
    v-model="resData" // 接口数据
  ></XForm>
  <!-- 数据 不分类 -->
  <XForm
    :data="base"
    v-model="resData" // 接口数据
  ></XForm>
</div>
</template>
<script>
import XForm from '@/components/common/xform'
export default {
  components: { XForm },
  data () {
    return {
      classifications: {
        base: '基本信息',
        userdata: '用户信息',
        other: '其它',
      },
      activeHide: {
        baseInfo: true // true, 表示 默认展开， false 表示 默认不展开
      },
      base: {
        num: {
          type: 'search-tips',
          componentName: 'searchTips',
          label: '号码',
          rules: this.$rules.str('请输入号', true, 'change'),
          $attrs: {
            url: 'api.search',
            keys: ['code'],
            formatData: this.formatData,
            valueKey: 'id',
            clearable: true
          },
          $on: {
            select: this.selectNumber,
            clear: this.clearNumber,
          }
        },
        region: {
          type: 'select',
          label: '区域'
        },
        questionContent: {
          label: '问卷标题',
          // 自定义标签
          render: (h, params) => {
            return [
              h('el-button', {
                props: {
                  type: 'text',
                },
                on: {
                  click: () => {
                    console.log(params)
                  }
                }
              }, params.questionContent),
            ]
          }
        },
        openStatus: {
          label: '是否启用',
          // 支持jsx语法
          render: () => {
            return (
              <el-radio-group value={this.formData.openStatus} onInput={this.changeOpenStatus}>
                <el-radio label="open">是</el-radio>
                <el-radio label="close">否</el-radio>
              </el-radio-group>
            )
          }
        }
        questionType: { // 用于详情展示
          label: '申请日期',
          format: (formData, key) => {} // 数据格式
        },
        filedId: {
          slot: 'filedId',
          label: '插槽式'
        }
      },
      userdata: {
        householderName: {
          type: 'input',
          label: '文本',
          getter (newVal, oldVal) {  // 用于限制 或更改输入框的值
            return newVal // 没有return 值 的时候 ，会默认 return newVal
          } 
        },
        keys: {
          componentName: 'el-input', // 支持其它非 默认 组件， 可自定义组件
          label: '名字'
        }
      },
      other: {
        dataTime: {
          type: 'date-picker',
          label: '时间',
          $attrs: {
            type: 'month',
          }
        }
      }
    }
  },
  methods: {
    changeOpenStatus(val) {
      this.formData.openStatus = val
    },
  }
}
</script>
