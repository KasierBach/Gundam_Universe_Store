import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, MessageSquareMore } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import chatService from '../../services/chatService'
import { useI18n } from '../../i18n/I18nProvider'
import { cn } from '../../utils/cn'

const StartConversationButton = ({
  recipientId,
  context = {},
  className,
  variant = 'primary',
  label,
  selfLabel,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale } = useI18n()
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const isSelf = !!recipientId && user?._id === recipientId
  const copy = locale === 'vi'
    ? {
        primary: 'Nhắn trước khi chốt đơn',
        secondary: 'Nhắn trực tiếp',
        login: 'Đăng nhập để nhắn',
        self: 'Đây là tài khoản của bạn',
        failed: 'Không thể mở cuộc trò chuyện lúc này.',
      }
    : {
        primary: 'Discuss before buying',
        secondary: 'Send direct message',
        login: 'Login to message',
        self: 'This is your account',
        failed: 'Unable to open the conversation right now.',
      }

  const resolvedLabel = label || (variant === 'ghost' ? copy.secondary : copy.primary)
  const resolvedSelfLabel = selfLabel || copy.self

  const handleStartConversation = async () => {
    if (isSelf || !recipientId || loading) return

    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location.pathname + location.search },
      })
      return
    }

    try {
      setLoading(true)
      const conversation = await chatService.startDirectConversation(recipientId, context)
      navigate(`/chat?conversation=${conversation._id}`)
    } catch (error) {
      console.error('Failed to open direct conversation:', error)
      window.alert(copy.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={loading || isSelf || !recipientId}
      onClick={handleStartConversation}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-orbitron uppercase tracking-[0.18em] transition-all disabled:cursor-not-allowed disabled:opacity-45',
        variant === 'ghost'
          ? 'border-gundam-cyan/35 bg-white/5 text-gundam-cyan hover:border-gundam-cyan hover:bg-gundam-cyan/10'
          : 'border-gundam-cyan bg-gundam-cyan text-black shadow-cyan-glow hover:bg-white',
        className
      )}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageSquareMore size={18} />}
      <span>{isSelf ? resolvedSelfLabel : (isAuthenticated ? resolvedLabel : copy.login)}</span>
    </button>
  )
}

export default StartConversationButton
