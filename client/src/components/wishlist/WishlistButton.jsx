import { useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import useWishlistStore from '../../stores/wishlistStore'
import { cn } from '../../utils/cn'

const WishlistButton = ({ productId, className, iconClassName }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const {
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    loading,
    isLoaded,
    isInWishlist,
  } = useWishlistStore()

  useEffect(() => {
    if (isAuthenticated && !isLoaded) {
      fetchWishlist()
    }
  }, [fetchWishlist, isAuthenticated, isLoaded])

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
      return
    }

    await addToWishlist(productId)
  }

  const active = isInWishlist(productId)

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'flex items-center justify-center transition-all disabled:opacity-60',
        active
          ? 'bg-gundam-red/15 text-gundam-red border border-gundam-red/40 shadow-[0_0_18px_rgba(239,68,68,0.18)]'
          : 'bg-gundam-bg-secondary text-gundam-text-primary border border-gundam-border hover:border-gundam-red/40 hover:text-gundam-red',
        className
      )}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={18} className={cn(active ? 'fill-current' : '', iconClassName)} />
    </button>
  )
}

export default WishlistButton
