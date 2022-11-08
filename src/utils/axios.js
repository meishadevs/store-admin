import axios from 'axios'
import storage from 'store'
import router from '@/router'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 请求内容的类型
const contentTypeList = [
  'application/vnd.ms-excel;charset=UTF-8',
  'application/vnd.ms-word;charset=UTF-8',
  'application/x-download;charset=UTF-8'
]

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl
    }

    return config
  }

  destroy (url) {
    delete this.queue[url]
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(request => {
      // 如果不是登录
      if (!request.url.includes('/user/login')) {
        request.headers['Content-type'] = 'application/json;charset=UTF-8'
        request.headers['Authorization'] = 'Bearer ' + storage.get(ACCESS_TOKEN)
      }

      this.queue[url] = true
      return request
    }, error => {
      console.log('error:', error)
      this.destroy(url)
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use(async (response) => {
      this.destroy(url)

      // 如果发起的 api 请求需要验证 token
      if (response.data.code && response.data.code !== 200 && !url.includes('/user/login')) {
        // token 过期返回登陆页面
        if (response.data.code === 401) {
          store.commit('CLEAR_USER_DATA')
          router.push({
            name: 'login'
          })
        // 请求错误
        } else {
          return Promise.reject(response.data)
        }
      } else if (contentTypeList.includes(response.headers['content-type'])) {
        return response

      // 不需要验证 token 的请求
      } else {
        if (response.data.code === 200) {
          return response.data
        } else {
          return Promise.reject(response.data)
        }
      }
    }, error => {
      // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
      this.destroy(url)
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break
          case 401:
            // 如果token过期或者不存在则跳转到登录页面
            window.location.href = '/login'
            // Msg.error('未登录，或者登录已过期，请登录')
            error.message = '未授权，请重新登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = '请求错误，未找到资源'
            break
          case 405:
            error.message = '请求方法未允许'
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器端出错'
            break
          case 501:
            error.message = '网络未实现'
            break
          case 502:
            error.message = '网络错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网络超时'
            break
          case 505:
            error.message = 'http版本不支持请求'
            break
          default:
            error.message = `链接错误${error.response.status}`
        }
      } else {
        error.message = '链接服务器失败'
      }
      return Promise.reject(error.message)
    })
  }

  request (options) {
    const instance = axios.create()

    // 解构对象
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
