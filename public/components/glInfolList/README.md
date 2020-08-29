<InfoList :list="dataList" col="2" />

```js
// 已全局注册
import InfoList from '@/components/common/infoList/infoList'
export default {
  components: {
    InfoList
  }
  data() {
    return {
      dataList: [
        {label: '业主ID', value: '', key: 'ownerId'},
        {label: '业主姓名', value: '', key: 'ownerName'},
        {label: '电话', value: '', key: 'telephone'},
        {label: '年龄',value: '', key: 'age'},
        {label: '考试成绩', value: '', key: 'score'},
        {label: '学历', value: '', key: 'education', format: (v) => this.lookup('stationPerson.education', v)},
        {label: '状态', value: '', key: 'salesStatus', format: (v) => this.lookup('stationPerson.salesStatus', v)},
        {label: '状态', value: '', key: 'salesStatus', format: (v) => this.lookup('stationPerson.salesStatus', v)},
        {label: '性别', value: '', key: 'sex', format: (v) => this.lookup('stationPerson.sex', v)},
        { label: '站点编号',
          value: '',
          key: 'stationCode', 
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
              }, params.stationCod),
            ]
          }
        },
      ]
    }
  }
}
```
