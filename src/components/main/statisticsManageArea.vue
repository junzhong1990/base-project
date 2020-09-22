
<template>
  <div class="statistics-area-div">
    <!--    展示统计分析的区域切换-->
    <span class="dss-area-name">（ 当前区域：{{ dssArea.label ? dssArea.label : '重庆市' }}）</span>
    <el-popover
      placement="bottom"
      trigger="hover"
      popper-class="set-popover">
      <span slot="reference" class="opr-icon el-icon-office-building" @click="areaDialog = true"></span>
      <div class="set-popover-text">
        <span class="set-popover-text" @click="areaDialog = true" >切换区域</span>
      </div>
    </el-popover>

    <el-dialog
      title="切换区域"
      :visible.sync="areaDialog"
      :append-to-body="true"

    >
      <el-tabs class="dss-area" v-model="activeName" type="card">
        <el-tab-pane v-for="(levelItem) in nameArr" :key="levelItem"  :name="levelItem" :label="areaAll[levelItem].name">
          <div class="area-btn" v-for="item in areaAll[levelItem].regionArr" :key="item.value" @click="btnClick(item)">
            {{ item.label }}
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>

  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        areaDialog: false,
        activeName: '',
        nameArr: ['level1', 'level2'],
        areaAll: {
          level1: {
            name: '一级区域',
            regionArr: []
          },
          level2: {
            name: '二级区域',
            regionArr: []
          },
        }
      }
    },
    computed: {
      // showStatisticsManage() {
      //   return this.$route.path.includes('/statisticsManage')
      // },
      ...mapGetters(['dssArea'])
    },
    created() {
      this.getRegion()
    },
    methods: {
      ...mapMutations(['SET_DSSAREA']),
      btnClick(item) {
        this.SET_DSSAREA(item)
        this.areaDialog = false
        // console.log(item)

        this.eventBus.$emit('regionalOptions', item)
      },
      dealData(regionData, flag) {
        let levelName = 'level' + flag
        regionData.forEach((val, i) => {
          this.areaAll[levelName].regionArr.push({
            value: val.regionId,
            label: val.regionName,
            regionLevel: val.regionLevel
          })
          if (val.children !== undefined) {
            this.dealData(val.children, flag + 1)
          }
        })
      },
      async getRegion() {
        let data = {
          status: 1
        }
        let res = await this.$api.getRegionScope({ data })
        if (res && res.code === 0) {
          let data = res.data
          if (res.data[0].regionId === -999) {
            // console.log('存在-999')
            data = res.data[0].children
            data.unshift({
              parentRegionId: 0,
              regionId: -999,
              regionLevel: 1,
              regionName: '全部'
            })
            // console.log('存在-999 data', data)
          }
          let initFlag = res.data[0].regionLevel
          // console.log('initFlag', initFlag)
          this.nameArr = this.nameArr.slice(initFlag - 1)
          this.activeName = `level${initFlag}`
          this.dealData(data, initFlag)
          // console.log('this.areaAll', this.areaAll)
          // console.log(this.areaAll[`level${initFlag}`].regionArr[0])
          this.SET_DSSAREA(this.areaAll[`level${initFlag}`].regionArr[0])
          this.eventBus.$emit('regionalOptions', this.areaAll[`level${initFlag}`].regionArr[0])
          this.$forceUpdate()
        }
      }
    }
  }
</script>

<style lang="less">
  .statistics-area-div {
    display: inline-block;
    .opr-icon {
      font-size: 22px;
      color: #666;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      cursor: pointer;
    }

    .dss-area-name {
      color: #567CDB;
    }
  }
  .dss-area {
    background-color: #f1f6fa;
    .area-btn{
      display: inline-block;
      width: 80px;
      font-size: 14px;
      line-height: 20px;
      padding: 4px 10px;
      text-align: center;
      vertical-align: middle;

      margin-left: 20px;
      margin-bottom: 10px;

      color: #ffffff;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
      border: 1px solid;
      background-color: #567CDB;
      border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      cursor: pointer;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
      &:hover {
        background-color: #3959A8;
      }
    }
    .el-tabs__item:hover {
      color: #555555;
    }
    .el-tabs__item.is-active {
      color: #555555;
      background-color: #ffffff;
    }

  }
</style>
