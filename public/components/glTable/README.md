
## table配置

```vue
<template>
  <glTable
    :data="tableData"
    :column="columnTitle">
      <el-table-column
        slot="handle"
        label="操作"
        width="150"
        fixed="right">
        <template slot-scope="scope">
        <!--操作按钮-->
        </template>
      </el-table-column>
  </glTable>
</template>
<script>
  export default {
    data() {
      return {
        columnTitle: [],
        tableData: [],
        pageInfo: {}
      }
    },
    methods: {
    }
  }
</script>

```

### 表头column配置

```js
[
  {
    label: '类型名称',
    prop: 'deviceTypeName',
    minWidth: 100
  },
  {
    label: '是否回收',
    prop: 'isRecover',
    width: 90,
    options: [
      {label: '是', value: 'yes'},
      {label: '否', value: 'no'}
    ],
    // options: this.lookUpOptions('yesOrNo')
  },
  {
    label: '备注',
    prop: 'remark',
    minWidth: 200,
    // 多级表头配置
    children: [
      {
        label: '备注1',
        prop: 'remark'
      },
      {
        label: '备注2',
        prop: 'remark'
      }
    ]
  },
  // 支持自定义
  {
    label: '标识图片',
    prop: 'fileUrl',
    minWidth: 100,
    render: (h, params) => {
      return [
        h('img', {
          attrs: {
            src: params.row.fileUrl,
            alt: '图片'
          },
          style: {
            width: '40px',
            height: '30px',
            backgroundSize: '100%'
          }
        }, params.row.fileUrl)
      ]
    }
  },
  {
    label: '任务名称',
    prop: 'taskName',
    minWidth: 150,
    style: {
      color: '#567CDB',
      cursor: 'pointer'
    },
    click: (index, row) => this.$router.push({ path: 'taskDetail', query: {id: row.id} })
  },
  {
    label: '已完成培训人数/培训总人数',
    prop: 'percentage',
    minWidth: 200,
    format: (row, prop) => `${row.finishPeople}/${row.totalJoinPeopleCount}`
  },
]
```
