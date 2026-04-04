import api from '../config/api';

const reviewService = {
  /**
   * Get all reviews for a product
   */
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data.data;
  },

  /**
   * Submit a new review
   * @param {Object} reviewData { productId, rating, comment }
   */
  submitReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data.data;
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data.data;
  }
};

export default reviewService;
