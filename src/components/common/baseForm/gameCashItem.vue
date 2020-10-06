<template>
  <!--游戏兑奖金额权限业务流程 发起流程的时候使用-->
  <div>
    <el-form-item
      :label="item.title"
      :prop="item.readOnly ? '' : item.prop"
      :class="{'siding':item.type==='minMax'}"
    >
      <el-select
        :filterable="item.filterable"
        :disabled="item.readOnly"
        v-model="form.gameId"
        :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
        :class="item.class"
        @change="changeSelectMain"
      >
        <el-option
          v-for="(items,index) in gameOptions"
          :key="index"
          :label="items.label"
          :value="items.value"
          :disabled="items.disabled"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="原单票最小兑奖金额" :class="{'siding':item.type==='minMax'}">
      <el-input disabled v-model="form.oldMinCashPerTicket"></el-input>
    </el-form-item>
    <el-form-item label="原单票最大兑奖金额" :class="{'siding':item.type==='minMax'}">
      <el-input disabled v-model="form.oldMaxCashPerTicket"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'gameCashItem',
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
      gameOptions: [],
      form: {}
    }
  },
  created() {
    console.log('this.item.prop', this.item, this.item.field)
    this.eventBus.$on('stationCodeChange', (stationPermission) => {
      console.log('站点权限列表监听到站点变化', stationPermission)
      this.getPermissionsList(stationPermission)
    })
  },
  methods: {
    getPermissionsList(list) {
      this.form = {}
      this.gameOptions = []
      this.gameOptions = list.map((op) => {
        return {
          label: op.gameName,
          value: op.gameId,
          minCashPerTicket: op.minCashPerTicket,
          maxCashPerTicket: op.maxCashPerTicket
        }
      })
    },
    changeSelectMain(val) {
      console.log('val', val)
      let checkedGame = this.gameOptions.find((op) => op.value === val)
      this.form.oldMinCashPerTicket = checkedGame.minCashPerTicket
      this.form.oldMaxCashPerTicket = checkedGame.maxCashPerTicket
      this.form.gameName = checkedGame.label
      console.log('form', this.form)
      this.$emit('gameCashItemValueBack', this.form)
    }
  }
}
</script>

<style lang="less">
</style>
