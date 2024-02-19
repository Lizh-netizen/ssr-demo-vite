import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  // @ts-expect-error TS(1343): The 'import.meta' meta-property is only allowed wh... Remove this comment to see the full error message
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
})
const instance1 = axios.create({
  baseURL: '',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
})
instance1.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export function Post1(url: any, data: any, isMultipart = false, token: any) {
  if (isMultipart) {
    // 设置请求头为 "multipart/form-data"
    instance1.defaults.headers['Content-Type'] = 'multipart/form-data'
  } else {
    // 使用默认的请求头 "application/json"
    instance1.defaults.headers['Content-Type'] = 'application/json'
  }
  instance1.defaults.headers['Authorization'] = token
  return new Promise((resolve, reject) => {
    instance1
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
instance.interceptors.request.use(
  (config: any) => {
    config.headers = {
      Authorization:
        sessionStorage.odos_token ||
        'eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRfaWQiOiI5N2FkMjAyNC03N2I5LTExZWUtOTYxOC1iODU5OWYyYThjNDAiLCJ1c2VyX2lkIjoyOTAsInVzZXJfa2V5IjoiZGMzODJiOTMtMTFlOC00YjY5LWEyOGQtNjJjZjM2NDY1OTYzIiwidXNlcm5hbWUiOiJsaXpoYW5naHVhIn0.kffqlbZHQUoCTcllIwRhMoQ9OT_-MNEELj7tFkNa7jA9z-gNfntxy3wROeBxXwZfhyqoTk0iNofFLrimQSs8UA'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  // @ts-expect-error TS(2345): Argument of type '(response: AxiosResponse<any, an... Remove this comment to see the full error message
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
    Post('/prod-api/business/globalDict/getDictListByType', {
      dictType: 'HTTPSTATUS',
      dictCode: '200'
    }).then((res) => {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      const found = res.data.find((item: any) => error.response.status == item.dictCode)
      ElMessage({
        type: 'error',
        message: found.dictCodeName
      })
    })
    return Promise.reject(error)
  }
)

export function Post(url: any, data: any, isMultipart = false) {
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

export function Get(url: any, params: any) {
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
export function Delete(url: any, data: any) {
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

export function Put(url: any, data: any) {
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
