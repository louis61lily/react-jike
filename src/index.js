import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from '@/router/index'
import { Provider } from 'react-redux'

import store from './store'
import './index.scss'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
        <RouterProvider router={router}>
            <App />
        </RouterProvider>
    </Provider>
)