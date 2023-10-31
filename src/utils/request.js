import axios from 'axios'
const instance = axios.create({
    baseURL: '/',
    timeout: 100000,
    headers: {
    'Content-Type': 'application/json'
  }
})
instance.interceptors.request.use((config) => {
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRfaWQiOiJmYWZiOTgwZC1lMTdiLTExZWQtOTY3ZS03Y2QzMGFlYjE1YmEiLCJ1c2VyX2lkIjoxLCJ1c2VyX2tleSI6IjQ2NGQ0MzJkLTQwNmQtNDM3Yi1hYTQ0LWM1ZGMxMmM5OWYxMyIsInVzZXJuYW1lIjoiYWRtaW4ifQ.y46hvt-_IvjeMP0J7BIbvWjYyc_Z94Y0skcsIfdx-LMFtjqBLRjqNDrN1bbHA00CczRELbJskZ0L_wi7YaogWg'
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
    console.error(' Error:', error);
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
        ).then((response) => {
        resolve(response.data)
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
        ).then((response) => {
        resolve(response.data)
    }).catch((err) => {
        reject(err)
    })
    })
    
}