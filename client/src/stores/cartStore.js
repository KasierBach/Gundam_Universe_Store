import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '../services/cartService';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      loading: false,
      error: null,

      /**
       * Internal helper to update items and totals
       */
      _updateCart: (items) => {
        const totalItems = items.reduce((total, item) => total + (item.quantity || 0), 0);
        const totalPrice = items.reduce((total, item) => {
          const price = item.product?.price || 0;
          return total + price * (item.quantity || 0);
        }, 0);
        set({ items: items || [], totalItems, totalPrice, loading: false, error: null });
      },

      /**
       * Fetch cart from server
       */
      fetchCart: async () => {
        set({ loading: true });
        try {
          const cart = await cartService.getCart();
          get()._updateCart(cart.items || []);
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      /**
       * Add item to cart
       */
      addToCart: async (productId, quantity = 1) => {
        set({ loading: true });
        try {
          const cart = await cartService.addItem(productId, quantity);
          get()._updateCart(cart.items || []);
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      /**
       * Update item quantity
       */
      updateQuantity: async (productId, quantity) => {
        try {
          const cart = await cartService.updateQuantity(productId, quantity);
          get()._updateCart(cart.items || []);
        } catch (error) {
          set({ error: error.message });
        }
      },

      /**
       * Remove item from cart
       */
      removeFromCart: async (productId) => {
        try {
          const cart = await cartService.removeItem(productId);
          get()._updateCart(cart.items || []);
        } catch (error) {
          set({ error: error.message });
        }
      },

      /**
       * Clear entire cart
       */
      clearCart: async () => {
        try {
          await cartService.clearCart();
          get()._updateCart([]);
        } catch (error) {
          set({ error: error.message });
        }
      },

      resetCartState: () => set({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        loading: false,
        error: null,
      }),
    }),
    {
      name: 'gundam-cart-storage',
      // Store items and totals in localStorage
      partialize: (state) => ({ 
        items: state.items, 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice 
      }),
    }
  )
);

export default useCartStore;
