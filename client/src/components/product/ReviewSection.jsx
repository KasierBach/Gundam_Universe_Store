import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiMessageSquare, FiSend, FiUser, FiTrash2, FiAlertCircle } from 'react-icons/fi'
import reviewService from '../../services/reviewService'
import useAuthStore from '../../stores/authStore'
import { useI18n } from '../../i18n/I18nProvider'

const ReviewSection = ({ productId }) => {
  const { locale } = useI18n()
  const { user, isAuthenticated } = useAuthStore()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const copy = locale === 'vi'
    ? {
      submitError: 'Không thể gửi đánh giá',
      deleteConfirm: 'Xóa đánh giá này?',
      title: 'Đánh giá sản phẩm',
      submitTitle: 'Gửi đánh giá mới',
      satisfaction: 'Mức độ hài lòng',
      feedback: 'Nhận xét chi tiết',
      feedbackPlaceholder: 'Nhập trải nghiệm sử dụng và đánh giá của bạn...',
      sending: 'ĐANG GỬI...',
      submit: 'GỬI ĐÁNH GIÁ',
      authRequired: 'Cần đăng nhập để gửi đánh giá',
      loading: 'Đang tải đánh giá...',
      empty: 'Chưa có đánh giá nào cho sản phẩm này',
      anonymous: 'Người dùng ẩn danh',
      timestamp: 'THỜI GIAN',
    }
    : {
      submitError: 'Failed to submit report',
      deleteConfirm: 'Delete this mission report?',
      title: 'Mission Reports',
      submitTitle: 'Submit New Report',
      satisfaction: 'Unit Satisfaction',
      feedback: 'Detailed Feedback',
      feedbackPlaceholder: 'ENTER MISSION DETAILS...',
      sending: 'SENDING...',
      submit: 'TRANSMIT REPORT',
      authRequired: 'Authentication Required to Submit Report',
      loading: 'Accessing Logs...',
      empty: 'No Mission Reports Available for this Unit',
      anonymous: 'Anonymous Pilot',
      timestamp: 'MISSION TIME',
    }

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  })

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await reviewService.getProductReviews(productId)
      setReviews(response)
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!newReview.comment.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      await reviewService.submitReview({
        productId,
        ...newReview,
      })
      setNewReview({ rating: 5, comment: '' })
      await fetchReviews()
    } catch (err) {
      setError(err.response?.data?.message || copy.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm(copy.deleteConfirm)) return
    try {
      await reviewService.deleteReview(reviewId)
      await fetchReviews()
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const renderStars = (rating, setRating = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!setRating}
          onClick={() => setRating && setRating(star)}
          className={setRating ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}
        >
          <FiStar
            size={14}
            className={star <= rating ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-gray-600'}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="mt-16 pt-16 border-t border-white/10">
      <div className="flex items-center gap-4 mb-10">
        <FiMessageSquare className="text-cyan-400 text-2xl" />
        <h2 className="text-2xl font-black font-orbitron tracking-tighter text-white uppercase italic">{copy.title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          {isAuthenticated ? (
            <div className="glass-card p-6 border-cyan-500/20 bg-cyan-950/5 sticky top-28">
              <h3 className="text-xs font-orbitron font-bold mb-6 text-cyan-400 uppercase tracking-widest italic">{copy.submitTitle}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-orbitron text-gray-500 uppercase">{copy.satisfaction}</label>
                  {renderStars(newReview.rating, (value) => setNewReview({ ...newReview, rating: value }))}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-orbitron text-gray-500 uppercase">{copy.feedback}</label>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={(event) => setNewReview({ ...newReview, comment: event.target.value })}
                    placeholder={copy.feedbackPlaceholder}
                    rows={4}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded p-4 text-xs font-rajdhani focus:border-cyan-400 outline-none transition-colors custom-scrollbar"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[10px] text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20 uppercase font-bold">
                    <FiAlertCircle /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded text-xs flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-cyan-glow disabled:opacity-50"
                >
                  {submitting ? copy.sending : copy.submit}
                  <FiSend />
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card p-8 border-dashed border-cyan-500/20 text-center flex flex-col items-center justify-center gap-4">
              <FiUser size={32} className="text-gray-600 opacity-30" />
              <p className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest leading-loose">
                {copy.authRequired}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">{copy.loading}</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center glass-card border-dashed border-white/5 opacity-50">
              <p className="text-sm font-rajdhani text-gray-500 uppercase tracking-widest italic">{copy.empty}</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-white/5 bg-white/[0.02] relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <FiUser className="text-cyan-400" size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {review.user?.displayName || copy.anonymous}
                      </h4>
                      <p className="text-[8px] text-gray-500 font-mono mt-1">
                        {copy.timestamp}: {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {renderStars(review.rating)}
                    {(user?._id === review.user?._id || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 p-1 transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm font-rajdhani text-gray-300 leading-relaxed pl-11">
                  {review.comment}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewSection
