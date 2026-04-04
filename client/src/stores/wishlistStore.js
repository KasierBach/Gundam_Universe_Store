import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import wishlistService from '../services/wishlistService'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      products: [],
      productIds: [],
      loading: false,
      error: null,
      isLoaded: false,

      _syncWishlist: (wishlist) => {
        const products = wishlist?.products || []
        set({
          products,
          productIds: products.map((product) => product._id),
          loading: false,
          error: null,
          isLoaded: true,
        })
      },

      fetchWishlist: async () => {
        set({ loading: true })
        try {
          const wishlist = await wishlistService.getWishlist()
          get()._syncWishlist(wishlist)
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false, isLoaded: false })
        }
      },

      addToWishlist: async (productId) => {
        set({ loading: true })
        try {
          const wishlist = await wishlistService.addProduct(productId)
          get()._syncWishlist(wishlist)
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false })
          throw error
        }
      },

      removeFromWishlist: async (productId) => {
        set({ loading: true })
        try {
          const wishlist = await wishlistService.removeProduct(productId)
          get()._syncWishlist(wishlist)
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false })
          throw error
        }
      },

      clearWishlist: async () => {
        set({ loading: true })
        try {
          const wishlist = await wishlistService.clearWishlist()
          get()._syncWishlist(wishlist)
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false })
          throw error
        }
      },

      isInWishlist: (productId) => get().productIds.includes(productId),

      resetWishlistState: () => set({
        products: [],
        productIds: [],
        loading: false,
        error: null,
        isLoaded: false,
      }),
    }),
    {
      name: 'gundam-wishlist-storage',
      partialize: (state) => ({
        products: state.products,
        productIds: state.productIds,
        isLoaded: state.isLoaded,
      }),
    }
  )
)

export default useWishlistStore
