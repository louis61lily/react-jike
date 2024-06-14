import { createSlice } from "@reduxjs/toolkit"
import { request, getValidToken, setValidToken } from "@/utils"

const userStore = createSlice({
    name: 'user',
    initialState: {
        token: getValidToken() || ''
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload
            setValidToken(action.payload)
        }
    }
})

const { setToken } = userStore.actions

const getToken = (loginForm) => {
    return async(dispatch) => {
        const res = await request.post('/authorizations', loginForm)
        if(res.message === 'OK') {
            dispatch(setToken(res.data.token))
        } else {
            throw new Error('登录异常')
        }
    }
}

const reducer = userStore.reducer

export { getToken }
export default reducer