<template>
  <li>
    <template v-for="item in menuData">
      <el-menu-item
        :index="item.code"
        :key="item.id"
        v-if="!item.children || !item.children.length"
        @click="to(item)"
        :class="item.className"
      >
        <glSvgIcon :iconClass="item.ico" class="ico" v-if="item.ico" />
        <span slot="title">{{item.text}}</span>
      </el-menu-item>
      <el-submenu :index="item.code" v-else :key="item.id" :class="item.className">
        <div class="submenu-title" slot="title">
          <glSvgIcon :iconClass="item.ico" class="ico" v-if="item.ico" />
          <span class="title">{{item.text}}</span>
        </div>
        <menu-tree :menuData="item.children"></menu-tree>
      </el-submenu>
    </template>
  </li>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'menuTree',
  props: ['menuData'],
  computed: {
    ...mapGetters(['dssResourceCode'])
  },
  methods: {
    ...mapMutations(['SET_DSSRESOURCECODE']),
    to(item) {
      // 存储跳转页面的信息，用于统计分析收藏夹获取当前页面的 code
      this.SET_DSSRESOURCECODE(item)
      let name = item.code
      let faFlag
      if (name.includes('&&fa')) {
        faFlag = name.split('&&fa').pop()
        name = name.split('&&fa')[0]
      }
      let activeName
      if (name.includes('?')) {
        activeName = name.split('?')[1]
        name = name.split('?')[0]
      }
      console.log(name)
      // console.log('activeName', activeName)
      this.$router.push({
        name,
        query: { activeName, faFlag }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.submenu-title {
  .title {
    font-weight: 600;
  }
}
.ico {
  font-size: 17px;
  margin-right: 7px;
}
</style>

