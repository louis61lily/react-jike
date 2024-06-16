import { createBrowserRouter } from 'react-router-dom'

import Login from "../pages/Login"
import Layout from "../pages/Layout"
import AuthRoute from '@/components/AuthRoute'
import { Suspense } from 'react'


// import Article from '@/pages/Article'
// import Publish from '@/pages/Publish'
// import Home from '@/pages/Home'

const Home = lazy(() => import('@/pages/Home'))
const Article = lazy(() => import('@/pages/Article'))
const Publish = lazy(() => import('@/pages/Publish'))

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            {
                index: 'true',
                element: <Suspense fallback='加载中'>
                            <Home></Home>
                        </Suspense>
            },
            {
                path: 'Article',
                element: <Suspense fallback='加载中'>
                            <Article></Article>
                        </Suspense>
            },
            {
                path: 'Publish',
                element: <Suspense fallback='加载中'>
                            <Publish />
                        </Suspense>
            }
        ]
    },
    {
        path: '/login',
        element: <Login></Login>
    }
])

export default router