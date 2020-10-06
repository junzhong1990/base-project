<template>
  <!-- 新增网点渠道选择 -->
  <div>
    <el-form-item label="渠道类型" :prop="item.readOnly ? '' : item.prop">
      <el-select
        @change="typeSelect"
        v-model="form.channelType"
        placeholder="请选择渠道类型"
        :disabled="item.readOnly"
      >
        <el-option
          v-for="item in $store.state.dicStore['station.channelType']"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="'管理机构'"
      :prop="item.readOnly ? '' : item.prop"
      v-if="form.channelType === 'channel'"
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

<script>
export default {
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
      form: {}
    }
  },
  async mounted() {
    await this.getAgent()
    if (this.item.towItemValueObj) {
      this.form = this.item.towItemValueObj
      this.form.channelName = this.$common.getLabel(this.agentOptions, this.form.channelCode)
      this.$emit('newStationAgentValueBack', this.form)
    }
  },
  methods: {
    async getAgent() {
      const res = await this.$api.queryAllAgents({})
      console.log(res)
      if (res && res.code === 0) {
        this.agentOptions = res.data
      } else {
        this.agentOptions = []
      }
    },
    channelSelect(val) {
      this.form.channelName = this.$common.getLabel(this.agentOptions, val)
      this.$emit('newStationAgentValueBack', this.form)
    },
    typeSelect(val) {
      this.$set(this.form, 'channelCode', '')
      this.$set(this.form, 'channelName', '')
      this.$emit('newStationAgentValueBack', this.form)
      this.$emit('clearCategory')
    }
  }
}
</script>

<style lang="less">
</style>
