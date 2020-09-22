
## 查询表单配置

```html
<QueryForm ref="query_form"
            :queryApiCode="searchApi"
            :itemList="itemList"
            @confirmSearchBackQuery="confirmSearchBackQuery"
            @tableData="getTableData"
            @tablePageInfo="getTablePageInfo">
  </QueryForm>
```

```js

export default {
  data() {
    return {
      searchApi: {
        apiCode: 'rewardPunishList', // 接口请求api
        resourceCode: 'rewardPunishList'， // 动态表单配置：该code为资源管理模块配置菜单的 资源编码 值
        content: { // 添加默认参数
          checkId: this.$route.query.checkId
        },
        type: 'confirmSearchBackQueryMode' // 手动触发查询
      },
      itemList: [], // 静态表单配置
      pageInfo: {},
      tableData: []
    }
  },
  methods: {
    // 获取列表信息
    getTableData(val) {
      this.tableData = val
    },
    // 获取列表分页信息
    getTablePageInfo(val) {
      this.pageInfo = val
    },
    // 手动触发查询
    confirmSearchBackQuery() {
    }
  }
}

```

> 如果不配置resourceCode，或者查询不到动态表单，则采用静态表单itemList的配置


```json

{
    "pageInfo":{
        "pageNum":1,
        "pageSize":20
    },
    "rewardPunishBeginTime_rewardPunishEndTime":[
        "2020-06-24",
        "2020-07-02"
    ],
    "rewardPunishBeginTime":"2020-06-24 00:00:00",
    "rewardPunishEndTime":"2020-07-02 00:00:00"
}
```
> 对于日期范围是分两个字段，在系统管理》流程表单
> 动态表单的类型编码配置为 rewardPunishBeginTime_rewardPunishEndTime


### itemList配置

```js
[
  {
    label: '输入框',
    value: 'stationCode',
    type: 'text'
  },
  {
    label: '选择框',
    value: 'regionType',
    type: 'select',
    options: []
  },
  {
    label: '所属区域',
    value: 'regionCode',
    type: 'commonCascader'
  },
  {
    label: '日期区间',
    value: 'selectDate',
    type: 'datePicker',
    format: 'daterange',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    options: {
      value1: 'rewardPunishBeginTime',
      value2: 'rewardPunishEndTime',
    }
  },
  {
    label: '单个时间',
    value: 'targetDate',
    type: 'datePicker',
    dayEnd: true, // 结束时间为23:59:59
    // format: 'year',
    // valueFormat: 'yyyy'
  },
  {
    label: '所属部门',
    value: 'departmentCode',
    type: 'deptCascader'
  },
  {
    label: '数据字典的数据是树形结构数据时',
    prop: 'regionType',
    field: 'regionType,regionTypeName',
    type: 'cascader',
    options: this.lookUpOptions('station.regionType')
  },
  {
    label: '是否签到',
    value: 'signIn',
    type: 'radioGroup',
    options:[
      {label: '是', value: 1},
      {label: '否', value: 0},
      {label: '签到失败', value: 2}
    ]
  },
]

```