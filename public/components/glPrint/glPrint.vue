<template>
  <div class="print-wrap">
    <el-button-group class="print-btn-wrap">
      <el-button type="primary" size="medium" icon="el-icon-printer" @click="handlePrint">打印</el-button>
      <el-button type="primary" size="medium" icon="el-icon-switch-button" @click="cancel">退出</el-button>
    </el-button-group>
    <div ref="print" class="print-content" id="printContent">
      <h2 class="title">{{data.title}}</h2>
      <slot name="print-header"></slot>
      <div class="print-box">
        <table
          class="print-table"
          border="1"
          cellpadding="0"
          cellspacing="0"
          style="border-collapse:collapse;"
        >
          <thead>
            <tr>
              <th
                v-for="(item, index) in tableTitle"
                :key="index"
                :width="item.width"
              >{{item.label}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(items, indexs) in tableData" :key="indexs">
              <td
                v-for="(item, index) in items"
                :key="index"
                v-html="$xss(item)"
                :class="{'content-wrap':isActive}"
                style="text-align:center;"
              ></td>
            </tr>
          </tbody>
        </table>
        <slot name="print-footer"></slot>
        <div
          class="print-bottom"
          style="padding: 16px 10px 0 10px;text-align:right;font-size:12px;"
        >
          <span>打印日期：{{printDate}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { IEVersion } from './utils'
export default {
  name: 'glPrint',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      printDate: '',
      tableTitle: [],
      tableData: [],
      isActive: false,
      newData: {},
      socket: null
    }
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.newData = {}
        Object.assign(this.newData, newVal)
        this.init(this.newData)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init(data) {
      this.isActive = data.title === '系统操作日志'
      this.printDate = new Date().toLocaleDateString().replace(/\//g, '-')
      let propArr = []
      data.props.forEach((item) => {
        propArr.push(item.prop)
      })
      // 如果表格头没有序号列配置，则添加序号列
      if (!~propArr.indexOf('index')) {
        propArr.unshift('index')
        this.tableTitle = JSON.parse(JSON.stringify(data.props))
        this.tableTitle.unshift({ prop: 'index', label: '序号', width: 60 })
      } else {
        this.tableTitle = JSON.parse(JSON.stringify(data.props))
      }
      // 如果没有width，设置一个基础宽度
      this.tableTitle.forEach((item) => {
        if (!item.width) {
          item.width = item.minWidth || 80
        }
      })
      // 处理数据
      this.tableData = []
      data.tableData.forEach((item, index) => {
        item.index = index + 1
        const valArr = []
        propArr.forEach((key) => {
          valArr.push(item[key])
        })
        this.tableData.push(valArr)
      })
    },
    handlePrint() {
      // 判断是否ie浏览器
      if (IEVersion() === -1) {
        this.$print(this.$refs.print)
      } else {
        // 获取当前页的html代码
        var printhtml = this.$refs.print.innerHTML
        var f = document.getElementById('printf')
        var printContent = document.getElementById('printContent')
        if (f) {
          printContent.removeChild(f)
        }
        var iframe = document.createElement('iframe')
        iframe.id = 'printf'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = 'none'
        printContent.appendChild(iframe)
        setTimeout(() => {
          iframe.contentDocument.write(printhtml)
          iframe.contentDocument.close()
          iframe.contentWindow.focus()
          iframe.contentWindow.print()
        }, 100)
      }
    },
    cancel() {
      this.newData = null
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="less" scoped>
.print-wrap {
  text-align: right;
}
.print-btn-wrap {
  padding: 10px 0 0;
}
.table-print {
  text-align: center;
}
.print-content {
  text-align: center;
  padding: 0px 3% 0px;
}
.print-table {
  width: 100%;
}
.print-box {
  padding-top: 20px;
}
.title {
  font-size: 16px;
  padding-top: 40px;
}
table th {
  height: 36px;
  background-color: #f8f8f9;
  line-height: 1.5;
  font-size: 12px;
}
table tr td {
  padding: 5px;
  font-size: 12px;
  word-break: break-all;
}
.content-wrap {
  text-align: left;
}
.content-wrap > ul {
  padding-left: 20px;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-left: 20px;
  }
  li {
    text-align: left;
    padding-right: 20px;
    flex: none;
    list-style-type: decimal;
  }
}
</style>
