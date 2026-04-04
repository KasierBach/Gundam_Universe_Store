import { useEffect } from 'react'
import Router from './Router'
import useAuthStore from './stores/authStore'
import { HUDOverlay } from './components/shared/HUDOverlay'
import useCartStore from './stores/cartStore'
import useWishlistStore from './stores/wishlistStore'
import useNotificationStore from './stores/notificationStore'
import useOrderStore from './stores/orderStore'

function App() {
  const { checkAuth, accessToken } = useAuthStore()
  const { fetchCart, resetCartState } = useCartStore()
  const { fetchWishlist, resetWishlistState } = useWishlistStore()
  const { fetchNotifications, resetNotificationState } = useNotificationStore()
  const { resetOrderState } = useOrderStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!accessToken) {
      resetCartState()
      resetWishlistState()
      resetNotificationState()
      resetOrderState()
      return
    }

    fetchCart()

    fetchWishlist()
    fetchNotifications()
  }, [
    accessToken,
    fetchCart,
    fetchNotifications,
    fetchWishlist,
    resetCartState,
    resetNotificationState,
    resetOrderState,
    resetWishlistState,
  ])

  return (
    <>
      <HUDOverlay />
      <Router />
    </>
  )
}

export default App
