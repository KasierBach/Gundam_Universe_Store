import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  chatDrafts: {},
  lastConversationId: null,
  tradeDraft: {
    title: '',
    description: '',
    wantedItems: '',
    condition: 'New (MISB)',
  },
  checkoutDraft: {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'COD',
  },
}

const useUiStore = create(
  persist(
    (set) => ({
      ...initialState,

      setChatDraft: (conversationId, value) =>
        set((state) => ({
          chatDrafts: {
            ...state.chatDrafts,
            [conversationId]: value,
          },
        })),

      clearChatDraft: (conversationId) =>
        set((state) => {
          const nextDrafts = { ...state.chatDrafts }
          delete nextDrafts[conversationId]
          return { chatDrafts: nextDrafts }
        }),

      setLastConversationId: (conversationId) => set({ lastConversationId: conversationId }),

      setTradeDraft: (patch) =>
        set((state) => ({
          tradeDraft: {
            ...state.tradeDraft,
            ...patch,
          },
        })),

      clearTradeDraft: () => set({ tradeDraft: initialState.tradeDraft }),

      setCheckoutDraft: (patch) =>
        set((state) => ({
          checkoutDraft: {
            ...state.checkoutDraft,
            ...patch,
          },
        })),

      clearCheckoutDraft: () => set({ checkoutDraft: initialState.checkoutDraft }),

      resetUiState: () => set(initialState),
    }),
    {
      name: 'gundam-ui-storage',
      partialize: (state) => ({
        chatDrafts: state.chatDrafts,
        lastConversationId: state.lastConversationId,
        tradeDraft: state.tradeDraft,
        checkoutDraft: state.checkoutDraft,
      }),
    }
  )
)

export default useUiStore
