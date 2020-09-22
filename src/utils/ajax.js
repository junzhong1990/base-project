import axios from 'axios'
import qs from 'qs'
// import storage from './storage'
import io from 'socket.io-client'
import { baseURL } from '@/api/baseConfig'
import { Message, Loading } from 'element-ui'
import * as userCache from '@/utils/userCache'

/* eslint-daiable */

axios.defaults.withCredentials = false
axios.defaults.headers.common['Content-Type'] = 'application/jsoncharset=UTF-8'
axios.defaults.baseURL = baseURL

/**
 * @description http请求
 * @param  {String} method 请求方法
 * @param  {String} path 请求路径
 * @param  {Object} options 请求配置
 * @param  {String} extend 请求拓展
 * @return {Function} result promise
 */
const request = (method, path, options, extend) => {
  // 接口地址切换配置
  if (typeof options.baseURL === 'string') {
    axios.defaults.baseURL = options.baseURL
  } else {
    axios.defaults.baseURL = baseURL
  }
  // 基本参数
  if (userCache.getToken()) {
    axios.defaults.headers.common['token'] = options.token || userCache.getToken()
  }
  axios.defaults.timeout = options.timeout || 30000
  let loading = null
  // 是否开启loading
  if (!options.closeLoading) {
    loading = Loading.service({
      fullscreen: true,
      // target: '#main',
      text: options.loadingText || '正在加载',
      spinner: 'el-icon-loading iconfont icon-loading',
      background: 'rgba(0,0,0,0)',
      customClass: 'gb-loading',
    })
  }
  return (async () => {
    try {
      let res
      const responseType = {
        responseType: options.responseType,
      } || {}
      if (extend === 'uploadFile') {
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
      }
      if (options.data && typeof options.data !== 'object') {
        // RESTful传参
        res = await axios[method](`${path}/${options.data}`)
      } else {
        const data = options.data || {}
        // 上传
        if (extend === 'upload') {
          res = await axios[method](path, data, {
            // 上传进度
            onUploadProgress: progressEvent => {
              if (options.onUploadProgress) {
                // 监听回调
                options.onUploadProgress(progressEvent)
              }
            },
          })
        } else if (extend === 'jsonp') {
          res = await axios[extend](`${axios.defaults.baseURL}${path}?${qs.stringify(data)}`)
        } else {
          switch (method) {
            case 'get':
              res = await axios[method](path, {
                params: data,
                ...responseType,
              })
              break
            case 'post':
              res = await axios[method](path, data, responseType)
              break
            case 'put':
              res = await axios[method](path, data)
              break
            case 'delete':
              res = await axios[method](path, data)
              break
            default:
              res = await axios[method](path, data, responseType)
          }
        }
      }
      // message提示
      if (res.data && res.data.code === 100) {
        Message.closeAll()
        res.data.msg && Message.warning(res.data.msg)
        userCache.clear()
        location.href = '#/login'
      } else if (res.data && parseInt(res.data.code) !== 0 && res.data.code === 180001) { // 180001校验接口，存在同名，已做表单校验提醒，不需要做
        Message.closeAll()
        res.data.msg && Message.warning(res.data.msg)
      } else {
        if (typeof options.message === 'string') {
          Message.closeAll()
          Message.success(options.message)
        }
      }

      loading && loading.close()

      // 下载文件append返回响应headers
      if (responseType.responseType) {
        return {
          headers: res.headers,
          blob: res.data,
        }
      }
      return extend === 'jsonp' ? res : res.data
    } catch (err) {
      Message.closeAll()
      Message.error('接口请求错误！')
      loading && loading.close()
    }
  })()
}

/**
 * @desc jsonp请求
 *  */
axios.jsonp = url => {
  if (!url) {
    console.error('jsonp-参数错误')
    return
  }
  return new Promise((resolve, reject) => {
    window.callback = result => {
      resolve(result)
    }
    var JSONP = document.createElement('script')
    JSONP.type = 'text/javascript'
    JSONP.src = `${url}&callback=callback`
    document.getElementsByTagName('head')[0].appendChild(JSONP)
    setTimeout(() => {
      document.getElementsByTagName('head')[0].removeChild(JSONP)
    }, 500)
  })
}

export default {
  get(path, options) {
    return request('get', path, options)
  },
  post(path, options, extend) {
    return request('post', path, options, extend)
  },
  upload(path, options) {
    return request('post', path, options, 'upload')
  },
  jsonp(path, options) {
    return request(null, path, options, 'jsonp')
  },
  put(path, options) {
    return request('put', path, options)
  },
  delete(path, options) {
    return request('delete', path, options)
  },
  ws(path, options) {
    const socket = io.connect(
      baseURL
        .replace(':8081/bms/api', ':30001')
        .replace(/^(http:\/\/)|\/\/{1}/, 'ws://'), {
      path,
      transports: ['websocket'],
      query: qs.stringify(options.data),
    }
    )
    return socket
  },
  baseURL,
}
