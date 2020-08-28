
```vue
<template>
  <glToolList :tools="tools" />
</template>
<script>
export default {
  data() {
    return {
      tools: [
        {
          label: '新增',
          icon: 'plus',
          func: () => {}
        },
        {
          label: '删除',
          icon: 'delete',
          func: () => {},
        },
        {
          label: '导出',
          type: 'menu',
          options: [
            {label: '导出EXCEL(当页数据)', key: 'curr'},
            {label: '导出EXCEL(全部数据)', key: 'all'}
          ],
          func: (val) => this.exportData(val)
        },
        {
          label: '类型选择',
          type: 'select',
          prop: 'taskType',
          defaultValue: '1',
          options: [
            {
            label: '按任务类型汇总',
              value: '1'
            },
            {
              label: '按区域汇总',
              value: '2'
            },
            {
              label: '按区域经理汇总',
              value: '3'
            }
          ],
          func: (val) => this.typeSelect(val)
        }
      ],
    }
  }
}
</script>

```
