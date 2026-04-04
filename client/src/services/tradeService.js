import api from '../config/api'

const tradeService = {
  /**
   * Get all trade listings with optional filters
   */
  getListings: async (params) => {
    const response = await api.get('/trades', { params })
    return response.data.data
  },

  /**
   * Get single listing detail
   */
  getListing: async (id) => {
    const response = await api.get(`/trades/${id}`)
    return response.data.data
  },

  /**
   * Create new trade listing
   */
  createListing: async (listingData) => {
    const config = listingData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined
    const response = await api.post('/trades', listingData, config)
    return response.data.data
  },

  /**
   * Submit an offer for a listing
   */
  createOffer: async (listingId, offerData) => {
    const config = offerData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined
    const response = await api.post(`/trades/${listingId}/offers`, offerData, config)
    return response.data.data
  },

  /**
   * Get offers for a listing (for owner)
   */
  getListingOffers: async (listingId) => {
    const response = await api.get(`/trades/${listingId}/offers`)
    return response.data.data
  },

  /**
   * Accept an offer
   */
  acceptOffer: async (listingId, offerId) => {
    const response = await api.patch(`/trades/${listingId}/offers/${offerId}/status`, { status: 'accepted' })
    return response.data.data
  },

  updateOfferStatus: async (listingId, offerId, status) => {
    const response = await api.patch(`/trades/${listingId}/offers/${offerId}/status`, { status })
    return response.data.data
  },

  getOffers: async (listingId) => {
    const response = await api.get(`/trades/${listingId}/offers`)
    return response.data.data
  },

  queryListings: async (params) => {
    const response = await api.get('/trades', { params })
    return response.data.data
  },

  getMyOffers: async () => {
    const response = await api.get('/trades/offers/me')
    return response.data.data
  },

  getSuggestions: async (params) => {
    const response = await api.get('/trades/suggestions/me', { params })
    return response.data.data
  },

  reportListing: async (listingId, payload) => {
    const response = await api.post(`/trades/${listingId}/report`, payload)
    return response.data.data
  },
}

export default tradeService
