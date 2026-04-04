import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import useNotificationStore from '../../stores/notificationStore'
import { useI18n } from '../../i18n/I18nProvider'

const NotificationPage = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
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
    <div className="min-h-screen bg-gundam-bg-primary pb-16 pt-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col gap-6 border-b border-gundam-border/20 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-orbitron uppercase tracking-tight text-white">{t('notifications.title')}</h1>
            <p className="mt-2 text-xs font-rajdhani uppercase tracking-[0.35em] text-gundam-text-muted">
              {t('notifications.subtitle')}
            </p>
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 text-xs font-orbitron uppercase tracking-widest text-gundam-cyan hover:text-white"
            >
              <CheckCheck size={16} /> {t('notifications.markAll')}
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="pt-20 text-center text-xs font-orbitron uppercase tracking-[0.3em] text-gundam-cyan">{t('notifications.syncing')}</div>
        ) : items.length === 0 ? (
          <div className="glass-card border-dashed border-gundam-cyan/20 p-16 text-center">
            <Bell size={52} className="mx-auto mb-6 text-gundam-cyan/40" />
            <h2 className="text-2xl font-orbitron uppercase tracking-tight text-white">{t('notifications.emptyTitle')}</h2>
            <p className="mt-3 font-rajdhani text-gundam-text-secondary">{t('notifications.emptyDescription')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => handleOpenNotification(item)}
                className={`glass-card w-full border p-5 text-left transition-all ${item.isRead ? 'border-gundam-border/20 opacity-80' : 'border-gundam-cyan/30 bg-gundam-cyan/5'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-orbitron uppercase tracking-tight text-white">{item.title}</p>
                    <p className="mt-2 text-gundam-text-secondary">{item.message}</p>
                    {item.link ? (
                      <p className="mt-3 text-xs font-orbitron uppercase tracking-widest text-gundam-cyan">{item.link}</p>
                    ) : null}
                  </div>
                  {!item.isRead ? (
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gundam-cyan" />
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
