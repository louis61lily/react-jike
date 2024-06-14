import { createSlice } from "@reduxjs/toolkit"
import {  getValidToken, setValidToken, clearValidToken } from "@/utils"
import { loginAPI, getUserInfoAPI } from "@/apis/use"

const userStore = createSlice({
    name: 'user',
    initialState: {
        token: getValidToken() || '',
        userInfo: {}
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload
            setValidToken(action.payload)
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload
        },
        clearUserInfo(state) {
            state.token = ''
            state.userInfo = {}
            clearValidToken()
        }
    }
})

const { setToken, setUserInfo, clearUserInfo } = userStore.actions

// 设置用户token的异步回调
const getToken = (loginForm) => {
    return async(dispatch) => {
        const res = await loginAPI(loginForm)
        if(res.message === 'OK') {
            dispatch(setToken(res.data.token))
        } else {
            throw new Error('登录异常')
        }
    }
}

// 获取用户信息的异步回调
const getUserInfo = () => {
    return async(dispatch) => {
        const res = await getUserInfoAPI()
        dispatch(setUserInfo(res.data))
    }
}

const reducer = userStore.reducer

export { getToken, getUserInfo, clearUserInfo }
export default reducer