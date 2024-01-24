import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization:
        sessionStorage.odos_token ||
        'eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRfaWQiOiI5N2FkMjAyNC03N2I5LTExZWUtOTYxOC1iODU5OWYyYThjNDAiLCJ1c2VyX2lkIjoyODIsInVzZXJfa2V5IjoiNDZjOTRmYzctNTdlMC00Nzk5LWI2YWEtNmM1NDYyZGM3MTM0IiwidXNlcm5hbWUiOiJnYW5sdSJ9.o_mmubNOnROoKqHZXy-OpcDAA8cOU3olNIsA5qhjXMOI4kv_T8JbFowJupXuCh5Cz0JDxTuQcISOIO3CS2qvKA'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) { 
      ElMessage({
        type: 'error',
        message: response.data.msg
      })
      return
    }
    return response
  },
  (error) => {
    // 在响应错误时做一些操作
    // if (error.response) {
    //   // 服务器返回错误状态码
    //   const status = error.response.status
    //   if (status === 400 || status === 500) {
    //     // 提示请求失败
    //     ElMessage({
    //       type: 'error',
    //       message: '请求失败，请稍后重试'
    //     })
    //   }
    // }
    // 在这里调用后端接口统一处理
    return Promise.reject(error)
  }
)

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
