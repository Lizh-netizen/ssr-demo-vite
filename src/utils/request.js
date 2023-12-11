import axios from 'axios'
import { ElMessage } from 'element-plus'
const instance = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 用于存储每个请求的标识和取消函数
export const pendingMap = new Map()

const getPendingUrl = (config) => [config.method, config.url].join('&')

export class AxiosCanceler {
  /**
   * 添加请求
   * @param config 请求配置
   */
  addPending(config) {
    this.removePending(config)
    const url = getPendingUrl(config)
    const controller = new AbortController()
    config.signal = controller.signal
    if (!pendingMap.has(url)) {
      // 如果当前请求不在等待中，将其添加到等待中
      pendingMap.set(url, controller)
    }
  }

  /**
   * 移除请求
   * @param config 请求配置
   */
  removePending(config) {
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
     // 如果当前请求在等待中，取消它并将其从等待中移除
       const abortController = pendingMap.get(url);
      if (abortController) {
        abortController.abort(url)
      }
      pendingMap.delete(url)
    }
  }
  removeAllPending() {
    pendingMap.forEach((abortController) => {
      if (abortController) {
        abortController.abort()
      }
    })
    this.reset()
  }

  /**
   * 重置
   */
  reset() {
    pendingMap.clear()
  }
}

const axiosCanceler = new AxiosCanceler()

instance.interceptors.request.use(
  (config) => {
   
    if (token) {
      config.headers.Authorization = sessionStorage.odos_token || ''
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  (response) => {
    // axiosCanceler.removePending(response.config)
    return response
  },
  (error) => {
    // axiosCanceler.removePending(error.config)
    // 在响应错误时做一些操作
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status
      if (status === 400 || status === 500) {
        // 提示请求失败
        ElMessage({
          type: 'error',
          message: '请求失败，请稍后重试'
        })
      }
    }
    return Promise.reject(error)
  }
)
export function createAxiosWithCancel() {
  const cancelAllRequests = () => {
    axiosCanceler.reset()
  }
  const cancelRequest = (url) => {
    axiosCanceler.removePending({ url })
  }

  return { axios: instance, cancelAllRequests, cancelRequest }
}

export function Post(url, data, isMultipart = false) {
  if (isMultipart) {
    // 设置请求头为 "multipart/form-data"
    instance.defaults.headers['Content-Type'] = 'multipart/form-data'
  } else {
    // 使用默认的请求头 "application/json"
    instance.defaults.headers['Content-Type'] = 'application/json'
  }
  return new Promise((resolve, reject) => {
    instance
      .post(url, data)
      .then((res) => {
        // 请求本身成功，但是业务逻辑错误
        if (res.data.code && res.data.code !== 200) {
          ElMessage({
            type: 'error',
            // 状态码500，未知错误
            message: res.data.msg ? res.data.msg : '发生未知错误'
          })
        }
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function Get(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, params)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
        // if (err.name === 'AbortError') {
        //   console.log('Request aborted:', err.message)
        // }
        // // 在这里处理
      })
  })
}
export function Delete(url, data) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, data)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function Put(url, data) {
  instance.defaults.headers['Content-Type'] = 'application/json'
  return new Promise((resolve, reject) => {
    instance
      .put(url, data)
      .then((res) => {
        if (res.data.code && res.data.code !== 200) {
          ElMessage({
            type: 'error',
            // 状态码500，未知错误
            message: res.data.msg ? res.data.msg : '发生未知错误'
          })
        }
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
