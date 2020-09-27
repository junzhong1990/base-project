import * as types from './mutation-types'
import storage from '@/utils/storage'

// 页面入口缓存更新，处理多窗口打开页面异常问题
if (storage.get('entry') && !storage.session.get('entry')) {
  storage.session.set('entry', storage.get('entry'))
}

export default {
  [types.SET_LOGININFO](state, data) {
    state.loginInfo = data
  },
  [types.SET_DSSAREA](state, data) {
    state.dssArea = data
  },
  [types.SET_DSSMENU](state, data) {
    state.dssMenu = data
  },
  [types.SET_DSSPAGEPARAM](state, data) {
    state.dssPageParam = data
  },
  [types.SET_DSSRESOURCECODE](state, data) {
    state.dssResourceCode = data
  },
  [types.SET_DICSTORE](state, data) {
    state.dicStore = data
    window.__lookup__ = data
    storage.set('dicData', data)
  },
  [types.SET_ROUTERTAGS](state, data) {
    let isRepeat = false
    state.routerTags.forEach(item => {
      if (item.routerName === data.routerName) {
        isRepeat = true
        // 路由参数更新
        if (JSON.stringify(item.query) !== JSON.stringify(data.query)) {
          item.query = data.query
        }

        if (data.childrenPageName) item.childrenPageName = data.childrenPageName
      }
    })
    if (!isRepeat) {
      state.routerTags.push(data)
    }

    storage.session.set('routerTags', state.routerTags)
  },
  [types.REMOVE_ROUTERTAGS](state, data) {
    state.routerTags.forEach((item, i) => {
      if (state.routerTags[i].routerName === data.routerName) {
        state.routerTags.splice(i, 1)
      }
    })
    storage.session.set('routerTags', state.routerTags)
  },
  [types.CLEAR_ROUTERTAGS](state) {
    state.routerTags = []
    storage.session.remove('routerTags')
  },
  [types.SET_FONTSIZE](state, data) {
    state.fsMode = data
    storage.set('fsMode', data)
  },
  [types.SET_FULL](state, boolean) {
    // console.log(boolean)
    state.isFull = boolean
  },
  [types.SET_ALLAREADATA](state, data) {
    // console.log(data)
    state.all_area_data = data
    // console.log(state)
  },
  [types.SET_ENTRYLIST](state, data) {
    state.entryList = data
  },
  [types.SET_MENUSHOW](state, data) {
    state.device = data
  },
  [types.SET_MENUOPEN](state, data) {
    state.menuOpen = data
  },
}
