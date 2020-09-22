<template>
  <!--游戏兑奖金额权限业务流程 发起流程的时候使用

  -->

  <div class="">
    <el-form-item label="渠道类型" :prop="item.readOnly ? '' : item.prop">
      <el-select @change="typeSelect" v-model="form.channelType" placeholder="请选择渠道类型"  :disabled="item.readOnly">
        <el-option v-for="item in $store.state.dicStore['station.channelType']" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="'渠道选择'"
      :prop="item.readOnly ? '' : item.prop"
      :class="{'siding':item.type=='minMax'}"
      v-if="form.channelType == 'channel'"
    >
      <el-select
        :filterable="item.filterable"
        :disabled="item.readOnly"
        v-model="form.channelCode"
        :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
        :class="item.class"
        @change="channelSelect"
      >
        <el-option
          v-for="(items,index) in agentOptions"
          :key="index"
          :label="items.label"
          :value="items.value"
          :disabled="items.disabled"
        ></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'gameCashItem',
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
        agentOptions: [],
        form: {},
      }
    },
    watch: {
      firstStageValue(val) {

      }
    },
    methods: {
      async getAgent() {
        let data = {
        }
        let res = await this.$api.queryAllAgents({ data })
        console.log(res)
        if (res && res.code == 0) {
          this.agentOptions = res.data
        } else {
          this.agentOptions = []
        }
      },
      getPermissionsList(list) {
        this.form = {}
        this.agentOptions = []
        this.agentOptions = list.map((op) => {
          return {
            label: op.gameName,
            value: op.gameId,
            minCashPerTicket: op.minCashPerTicket,
            maxCashPerTicket: op.maxCashPerTicket,
          }
        })
      },
      channelSelect(val) {
        this.form.channelName = this.$common.getLabel(this.agentOptions, val)
        this.$emit('newStationAgentValueBack', this.form)
      },
      typeSelect(val) {
        this.$set(this.form, 'channelCode', '')
        this.$set(this.form, 'channelName', '')
        this.$emit('newStationAgentValueBack', this.form)
      },
    },
    async mounted() {
      this.getAgent()
      this.eventBus.$on('newStationAgentChange', (allForm) => {
        this.$set(this.form, 'channelType', allForm.channelType)
        this.$set(this.form, 'channelCode', allForm.channelCode)
        this.$set(this.form, 'channelName', allForm.channelName)
        this.$emit('newStationAgentValueBack', this.form)
      })
    },
    created() {
    }
  }
</script>

<style lang="less">

</style>
