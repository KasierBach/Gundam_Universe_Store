import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Camera, Mail, MapPin, Phone, Save, Shield, Target, User, X } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import userService from '../../services/userService'
import { useI18n } from '../../i18n/I18nProvider'

const ProfilePage = () => {
  const { t } = useI18n()
  const { user, setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: '',
    },
  })
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || { street: '', ward: '', district: '', city: '' },
      })
    }
  }, [user])

  const handleUpdateProfile = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const updatedUser = await userService.updateProfile(formData)
      setAuth(updatedUser, useAuthStore.getState().accessToken, useAuthStore.getState().refreshToken)
      setEditing(false)
    } catch (err) {
      console.error(err)
      alert(t('profile.updateError'))
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpdate = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    try {
      setLoading(true)
      const updatedUser = await userService.updateAvatar(file)
      setAuth(updatedUser, useAuthStore.getState().accessToken, useAuthStore.getState().refreshToken)
    } catch (err) {
      console.error(err)
      alert(t('profile.avatarError'))
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="pt-32 text-center font-orbitron animate-pulse text-gundam-cyan">{t('profile.loading')}</div>
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pb-12 pt-24">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:col-span-1"
        >
          <div className="relative overflow-hidden rounded-lg border border-gundam-cyan/30 bg-gundam-dark-surface/50 p-8 shadow-2xl backdrop-blur-md">
            <div className="hud-line absolute left-0 top-0 w-full opacity-30" />

            <div className="flex flex-col items-center">
              <div className="group relative mb-6">
                <div className="relative h-32 w-32 overflow-hidden rounded border-2 border-gundam-cyan/50 bg-black p-1">
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt="Pilot Avatar" className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-gundam-cyan/30">
                      <User size={64} />
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gundam-cyan border-t-transparent" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded bg-gundam-cyan text-black shadow-lg transition-all hover:bg-white"
                >
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpdate} accept="image/*" />
              </div>

              <h2 className="mb-1 text-2xl font-orbitron uppercase tracking-tighter text-white glow-text">
                {user.displayName}
              </h2>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-orbitron font-bold uppercase tracking-widest text-gundam-cyan opacity-70">
                <Shield size={12} /> {t('profile.rank')}
              </div>

              <div className="mt-4 grid w-full grid-cols-2 gap-4 border-t border-gundam-cyan/10 pt-6">
                <ProfileMetric label={t('profile.compatibility')} value={`${user.reputation?.score || 0}%`} />
                <ProfileMetric label={t('profile.missions')} value="12" />
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-gundam-cyan/10 pt-6">
              <div className="flex items-center justify-between text-[10px] font-orbitron uppercase">
                <span className="text-gundam-text-muted">{t('profile.status')}</span>
                <span className="animate-pulse font-bold tracking-widest text-gundam-emerald">{t('profile.active')}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-gundam-cyan" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-orbitron uppercase">
                <span className="text-gundam-text-muted">{t('profile.memberSince')}</span>
                <span className="tracking-widest text-white opacity-60">{new Date(user.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-gundam-cyan/10 bg-gundam-bg-secondary/50 p-6 text-[10px] font-orbitron uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 font-bold text-gundam-cyan">
              <Activity size={14} /> {t('profile.telemetry')}
            </div>
            <p className="leading-relaxed italic text-gundam-text-muted opacity-50">
              {t('profile.telemetryDescription')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 lg:col-span-2"
        >
          <div className="flex gap-8 border-b border-gundam-cyan/20 pb-1">
            {[t('profile.tabs.logs'), t('profile.tabs.logistics'), t('profile.tabs.settings')].map((tab) => (
              <button
                key={tab}
                className={`relative px-2 pb-4 font-orbitron text-[11px] uppercase tracking-widest transition-all ${tab === t('profile.tabs.logistics') ? 'font-bold text-gundam-cyan' : 'text-gundam-text-muted hover:text-white'}`}
              >
                {tab}
                {tab === t('profile.tabs.logistics') && <div className="glow-box absolute bottom-0 left-0 h-0.5 w-full bg-gundam-cyan" />}
              </button>
            ))}
          </div>

          <div className="relative rounded-lg border border-gundam-cyan/10 bg-gundam-dark-surface/30 p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-xl font-orbitron uppercase tracking-wider text-white">
                <Target size={20} className="text-gundam-cyan" /> {t('profile.logisticsTitle')}
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded border border-gundam-cyan px-6 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan shadow-cyan-glow/20 transition-all hover:bg-gundam-cyan/10"
                >
                  {t('profile.reconfigure')}
                </button>
              ) : null}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <ProfileField
                  label={t('profile.callSign')}
                  icon={<User size={12} />}
                  value={formData.displayName}
                  disabled={!editing || loading}
                  onChange={(event) => setFormData({ ...formData, displayName: event.target.value })}
                />
                <ProfileField
                  label={t('profile.directChannel')}
                  icon={<Mail size={12} />}
                  value={user.email}
                  disabled
                  hint={t('profile.channelHint')}
                />
                <ProfileField
                  label={t('profile.comms')}
                  icon={<Phone size={12} />}
                  value={formData.phone}
                  placeholder={t('profile.phonePlaceholder')}
                  disabled={!editing || loading}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                />
                <ProfileField
                  label={t('profile.sector')}
                  icon={<MapPin size={12} />}
                  value={formData.address.city}
                  placeholder={t('profile.cityPlaceholder')}
                  disabled={!editing || loading}
                  onChange={(event) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: event.target.value },
                  })}
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="flex items-center gap-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan opacity-60">
                  <MapPin size={12} /> {t('profile.coordinates')}
                </label>
                <textarea
                  disabled={!editing || loading}
                  rows="3"
                  className="w-full resize-none rounded border border-gundam-cyan/20 bg-black/40 p-4 font-rajdhani italic text-white outline-none transition-all focus:border-gundam-cyan"
                  value={formData.address.street}
                  onChange={(event) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: event.target.value },
                  })}
                />
              </div>

              <AnimatePresence>
                {editing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 pt-6"
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-2 bg-gundam-cyan py-4 font-orbitron font-bold uppercase tracking-[0.2em] text-black shadow-cyan-glow transition-all hover:bg-white disabled:opacity-50"
                    >
                      {loading ? t('profile.transmitting') : (
                        <>
                          {t('profile.save')} <Save size={18} />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 border border-gundam-red px-8 py-4 font-orbitron font-bold uppercase tracking-widest text-gundam-red transition-all hover:bg-gundam-red/10"
                    >
                      {t('profile.discard')} <X size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MiniStat label={t('profile.xp')} value="2,480" />
            <MiniStat label={t('profile.signalSuccess')} value="100%" accent="text-gundam-emerald hover:border-gundam-emerald/30" />
            <MiniStat label={t('profile.fleetCapacity')} value="50" accent="hover:border-gundam-red/30" />
            <MiniStat label={t('profile.archiveLogs')} value="5" accent="hover:border-gundam-amber/30" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const ProfileMetric = ({ label, value }) => (
  <div className="text-center">
    <span className="mb-1 block text-[9px] font-orbitron uppercase text-gundam-text-muted">{label}</span>
    <span className="text-xl font-orbitron text-white">{value}</span>
  </div>
)

const ProfileField = ({ label, icon, hint, disabled, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan opacity-60">
      {icon} {label}
    </label>
    <input
      disabled={disabled}
      className={`w-full rounded p-4 outline-none transition-all font-rajdhani ${disabled && !props.onChange ? 'border border-white/5 bg-black/40 text-white/40' : 'border border-gundam-cyan/20 bg-black/40 text-white focus:border-gundam-cyan'} disabled:opacity-50`}
      {...props}
    />
    {hint ? <span className="mt-1 block text-[8px] uppercase italic tracking-tighter text-gundam-text-muted">{hint}</span> : null}
  </div>
)

const MiniStat = ({ label, value, accent = 'hover:border-gundam-cyan/30' }) => (
  <div className={`group rounded border border-gundam-cyan/5 bg-gundam-dark-surface/20 p-4 text-center transition-all ${accent}`}>
    <span className="mb-2 block text-[9px] font-orbitron uppercase text-gundam-text-muted opacity-50">{label}</span>
    <span className="text-xl font-orbitron tracking-widest text-white">{value}</span>
  </div>
)

export default ProfilePage
