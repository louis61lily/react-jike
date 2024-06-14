import { createBrowserRouter } from 'react-router-dom'

import Login from "../pages/Login"
import Layout from "../pages/Layout"
import AuthRoute from '@/components/AuthRoute'
import Article from '@/pages/Article'
import Publish from '@/pages/Publish'
import Home from '@/pages/Home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            {
                index: 'true',
                element: <Home></Home>
            },
            {
                path: 'Article',
                element: <Article></Article>
            },
            {
                path: 'Publish',
                element: <Publish></Publish>
            }
        ]
    },
    {
        path: '/login',
        element: <Login></Login>
    }
])

export default router