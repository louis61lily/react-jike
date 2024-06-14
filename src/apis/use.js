import { request } from '@/utils/request'

// 用户相关的请求

// 1.登录请求
function loginAPI(formData) {
    return request({
        url: '/authorizations',
        method: 'POST',
        data: formData
    })
}

// 2.获取用户信息
function getUserInfoAPI() {
    return request({
        url: '/user/profile',
        method: 'GET'
    })
}

export { loginAPI, getUserInfoAPI }