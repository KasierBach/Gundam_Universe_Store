import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import useNotificationStore from '../../stores/notificationStore'

const NotificationPage = () => {
  const navigate = useNavigate()
  const { items, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleOpenNotification = async (item) => {
    if (!item.isRead) {
      await markAsRead(item._id)
    }

    if (item.link) {
      navigate(item.link)
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gundam-border/20 pb-8">
          <div>
            <h1 className="text-4xl font-orbitron text-white uppercase tracking-tight">Notification Center</h1>
            <p className="mt-2 text-gundam-text-muted font-rajdhani uppercase tracking-[0.35em] text-xs">
              Live command alerts, trade signals and mission updates
            </p>
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 text-gundam-cyan font-orbitron text-xs uppercase tracking-widest hover:text-white"
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="pt-20 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-[0.3em]">Syncing tactical alerts...</div>
        ) : items.length === 0 ? (
          <div className="glass-card border-dashed border-gundam-cyan/20 p-16 text-center">
            <Bell size={52} className="mx-auto text-gundam-cyan/40 mb-6" />
            <h2 className="text-2xl font-orbitron text-white uppercase tracking-tight">No incoming alerts</h2>
            <p className="mt-3 text-gundam-text-secondary font-rajdhani">Your tactical feed is clear. New trade, chat and moderation events will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => handleOpenNotification(item)}
                className={`w-full text-left glass-card border p-5 transition-all ${item.isRead ? 'border-gundam-border/20 opacity-80' : 'border-gundam-cyan/30 bg-gundam-cyan/5'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-orbitron uppercase tracking-tight">{item.title}</p>
                    <p className="mt-2 text-gundam-text-secondary">{item.message}</p>
                    {item.link ? (
                      <p className="mt-3 text-gundam-cyan text-xs font-orbitron uppercase tracking-widest">{item.link}</p>
                    ) : null}
                  </div>
                  {!item.isRead ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-gundam-cyan animate-pulse" />
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPage
