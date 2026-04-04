import { useEffect } from 'react'
import Router from './Router'
import useAuthStore from './stores/authStore'
import { HUDOverlay } from './components/shared/HUDOverlay'

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <HUDOverlay />
      <Router />
    </>
  )
}

export default App
