import { getValidToken } from "@/utils"
import { Navigate } from "react-router-dom"

function AuthRoute({ children }) {
    const token = getValidToken()
    if(token) {
        return <>{children}</>
    } else {
        return <Navigate to="/login" replace/>
    }
}

export default AuthRoute