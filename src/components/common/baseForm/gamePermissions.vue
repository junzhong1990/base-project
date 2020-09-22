<template>
  <!--夜间销售权限
游戏权限列表
  -->
  <el-table
    border stripe
    :data="permissionsList"
    style="width: 100%">
    <el-table-column label="序号" type="index" width="50"></el-table-column>
    <el-table-column prop="gameName" label="游戏"></el-table-column>
    <el-table-column
      prop="timeSign"
      label="是否开通"
      >
      <template slot-scope="scope">
        <el-select @change="selectChange" v-model="scope.row.timeSign" placeholder="请选择" :disabled="item.readOnly?item.readOnly:false">
          <el-option
            v-for="item in $store.state.dicStore['stationPermission.timeSign']"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="forbidSaleStartTime" label="禁止销售开始时间">
      <template slot-scope="scope">
        {{ fommatTime(scope.row.forbidSaleStartTime)  }}
      </template>
    </el-table-column>

    <el-table-column prop="forbidSaleEndTime" label="禁止销售结束时间">
      <template slot-scope="scope">
        {{ fommatTime(scope.row.forbidSaleEndTime)  }}

      </template>
    </el-table-column>



  </el-table>

</template>

<script type="text/ecmascript-6">

  export default {
    name: 'gamePermissions',
    components: {
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {

        permissionsList: [],
      }
    },
    watch: {
    },
    methods: {
      fommatTime(timeOrigin) {
        let rst = ''
        if (timeOrigin) {
          rst = `${timeOrigin.slice(0, 2)}:${timeOrigin.slice(2, 4)}:${timeOrigin.slice(4, 6)}`
        }
        return rst

      },
      selectChange( val) {

        let form = {}
        form[this.item.prop] = this.permissionsList
        this.$emit('gamePermissionsValueBack', form)
      },
      getPermissionsList(stationPermission) {
        //  4:时时彩     6:快乐十分
        console.log('站点变化', stationPermission)
        this.permissionsList = JSON.parse(JSON.stringify([
          {
            gameName: '时时彩',
            gameId: 4,
            timeSign: '',
            forbidSaleStartTime: '',
            forbidSaleEndTime: ''
          },
          {
            gameName: '快乐十分',
            gameId: 6,
            timeSign: '',
            forbidSaleStartTime: '',
            forbidSaleEndTime: ''
          },
        ]))
        // 值为空的时候如何处理
        stationPermission.forEach((item) => {
          if (item.gameId == '4') {
            this.permissionsList[0].timeSign = item.timeSign
            this.permissionsList[0].forbidSaleEndTime = item.forbidSaleEndTime
            this.permissionsList[0].forbidSaleStartTime = item.forbidSaleStartTime

          } else if(item.gameId == '6') {
            this.permissionsList[1].timeSign = item.timeSign
            this.permissionsList[1].forbidSaleEndTime = item.forbidSaleEndTime
            this.permissionsList[1].forbidSaleStartTime = item.forbidSaleStartTime

          }
        })
        this.selectChange()

      },

    },
    async mounted() {

    },
    created() {
      this.permissionsList = [
        {
          gameName: '时时彩',
          gameId: 4,
          timeSign: '',
          forbidSaleStartTime: '',
          forbidSaleEndTime: ''
        },
        {
          gameName: '快乐十分',
          gameId: 6,
          timeSign: '',
          forbidSaleStartTime: '',
          forbidSaleEndTime: ''
        },
      ]
      if (this.item.value) {
        this.permissionsList = this.item.value
        console.log('this.item.value', this.item.value)
        let stationPermission = this.item.value
        stationPermission.forEach((item) => {
          if (item.gameId == '4') {
            this.permissionsList[0].id = item.id
            this.permissionsList[0].timeSign = item.timeSign
            this.permissionsList[0].forbidSaleEndTime = item.forbidSaleEndTime
            this.permissionsList[0].forbidSaleStartTime = item.forbidSaleStartTime

          } else if(item.gameId == '6') {
            this.permissionsList[1].id = item.id
            this.permissionsList[1].timeSign = item.timeSign
            this.permissionsList[1].forbidSaleEndTime = item.forbidSaleEndTime
            this.permissionsList[1].forbidSaleStartTime = item.forbidSaleStartTime

          }
        })
      }
      this.eventBus.$on('stationCodeChange', (stationPermission) => {
        console.log('站点权限列表监听到站点变化', stationPermission)
        this.getPermissionsList(stationPermission)
      })

    }
  }
</script>

<style lang="less">

</style>
