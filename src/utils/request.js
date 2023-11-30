import axios from 'axios'
import { ElMessage } from 'element-plus'
const instance = axios.create({
    baseURL: '/',
    timeout: 100000,
    headers: {
    'Content-Type': 'application/json'
  }
})
instance.interceptors.request.use((config) => {
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRfaWQiOiI5N2FkMjAyNC03N2I5LTExZWUtOTYxOC1iODU5OWYyYThjNDAiLCJ1c2VyX2lkIjoyNzksInVzZXJfa2V5IjoiMWU0MTdkMjUtZDU2Ny00ZWIyLTg2ZTktYzBkNGJmM2JlMzM2IiwidXNlcm5hbWUiOiJhZG1pbiJ9.gdJpn1QL_h6aC0s9xvTNKJA6ONZlaiow7vJoUgy4TngZYpwApUT5a2UqCATVe7EOT5BUTtXWuAtt2VASC_LfDQ'
    // const token = localStorage.getItem('jc_odos_token')
    if (token) {
    config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {return Promise.reject(error)}
)
instance.interceptors.response.use((response) => {
    return response
}, (error) => {
    // 在响应错误时做一些操作
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status;
      if (status === 400 || status === 500) {
        // 提示请求失败
        ElMessage({
          type: 'error',
          message: '请求失败，请稍后重试',
        });
      }
    }
    return Promise.reject(error)
})
export function Post(url, data, isMultipart =false){
    if (isMultipart) {
      // 设置请求头为 "multipart/form-data"
      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
    } else {
      // 使用默认的请求头 "application/json"
      instance.defaults.headers['Content-Type'] = 'application/json';
    }
    return new Promise((resolve, reject) => {   
        instance.post(url, data
        ).then((res) => {
            // 请求本身成功，但是业务逻辑错误
        if (res.data.code && res.data.code !== 200) {
            ElMessage({
            type: 'error',
            // 状态码500，未知错误
            message: res.data.msg ? res.data.msg: '发生未知错误'})
        }
        resolve(res.data)
    }).catch((err) => {
        reject(err)
    })
    })
    
}
export function Get(url, params){
    return new Promise((resolve, reject) => {
        instance.get(url, params
        ).then((response) => {
        resolve(response.data)
    }).catch((err) => {
        reject(err)
    })
    })
    
}

export function Delete(url, data){
    return new Promise((resolve, reject) => {
        instance.delete(url, data
        ).then((response) => {
        resolve(response.data)
    }).catch((err) => {
        reject(err)
    })
    })
    
}

export function Put(url, data){
    instance.defaults.headers['Content-Type'] = 'application/json';
    return new Promise((resolve, reject) => {
        instance.put(url, data
        ).then((res) => {
             if (res.data.code && res.data.code !== 200) {
            ElMessage({
            type: 'error',
            // 状态码500，未知错误
            message: res.data.msg ? res.data.msg: '发生未知错误'})
        }
        resolve(res.data)
    }).catch((err) => {
        reject(err)
    })
    })
    
}