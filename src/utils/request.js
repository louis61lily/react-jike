import axios from 'axios'
import { getValidToken, clearValidToken } from './handleToken'
import router from '@/router'
import { message } from 'antd'

const request = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
    const token = getValidToken()
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
}, (error) => {
    return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.dir(error)
    if (error.response.status === 401) {
        clearValidToken()
        router.navigate('/login')
        message.warning('登录失效，请重新登录！')
        window.location.reload()
    }
    return Promise.reject(error)
})

export { request }