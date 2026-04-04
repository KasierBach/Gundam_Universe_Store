import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gundam-bg-primary">
        <div className="w-12 h-12 border-4 border-gundam-cyan border-t-transparent rounded-full animate-spin shadow-cyan-glow" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard
