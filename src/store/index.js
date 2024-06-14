import { configureStore } from '@reduxjs/toolkit'

import userReducer from '@/store/module/user'

const store = configureStore({
    reducer: {
        // 注册子模块
        user: userReducer
    }
})

export default store
