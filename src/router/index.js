import { createBrowserRouter } from 'react-router-dom'

import Login from "../pages/Login"
import Layout from "../pages/Layout"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout></Layout>
    },
    {
        path: '/login',
        element: <Login></Login>
    }
])

export default router