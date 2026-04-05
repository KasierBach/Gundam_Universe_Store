import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import SeoHead from '../../components/shared/SeoHead'
import useAuthStore from '../../stores/authStore'
import { useI18n } from '../../i18n/I18nProvider'

const LoginPage = () => {
  const { t, locale } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login, isLoading, rememberMe, rememberedEmail, setRememberMe } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail)
    }
  }, [rememberedEmail])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(email, password, { rememberMe })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || t('auth.login.error'))
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-12 pt-24">
      <SeoHead
        locale={locale}
        path="/login"
        robots="noindex, nofollow"
        title={locale === 'vi' ? 'Đăng nhập hệ thống' : 'Pilot login'}
        description={
          locale === 'vi'
            ? 'Trang đăng nhập để truy cập tài khoản Gundam Universe, giỏ hàng, trade hub, chat và dashboard quản trị.'
            : 'Login page for accessing Gundam Universe accounts, carts, trade tools, chat, and dashboard features.'
        }
      />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gundam-cyan/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-gundam-cyan/30 bg-gundam-cyan/10 shadow-cyan-glow"
          >
            <ShieldCheck size={32} className="text-gundam-cyan" />
          </motion.div>
          <h2 className="font-orbitron text-3xl font-black tracking-widest text-gundam-text-primary">{t('auth.login.title')}</h2>
          <p className="mt-2 font-rajdhani text-xs uppercase tracking-widest text-gundam-text-secondary">{t('auth.login.subtitle')}</p>
        </div>

        <div className="glass-card relative border-gundam-border/50 p-8">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-gundam-cyan/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 rounded-lg border border-gundam-red/50 bg-gundam-red/10 p-4 text-sm text-gundam-red-glow"
              >
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-orbitron uppercase tracking-widest text-gundam-text-secondary">{t('auth.login.email')}</label>
              <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted transition-colors group-focus-within:text-gundam-cyan">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="pilot@uc-era.com"
                  className="w-full rounded-lg border border-gundam-border bg-gundam-bg-tertiary py-3 pl-10 pr-4 font-rajdhani text-gundam-text-primary transition-all focus:border-gundam-cyan focus:outline-none focus:ring-1 focus:ring-gundam-cyan/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-orbitron uppercase tracking-widest text-gundam-text-secondary">{t('auth.login.password')}</label>
                <Link to="/forgot-password" className="text-[10px] font-orbitron uppercase text-gundam-cyan hover:underline">
                  {t('auth.login.forgot')}
                </Link>
              </div>
              <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted transition-colors group-focus-within:text-gundam-cyan">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gundam-border bg-gundam-bg-tertiary py-3 pl-10 pr-4 font-rajdhani text-gundam-text-primary transition-all focus:border-gundam-cyan focus:outline-none focus:ring-1 focus:ring-gundam-cyan/30"
                />
              </div>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-gundam-border/60 bg-gundam-bg-tertiary/70 px-4 py-3 text-sm text-gundam-text-secondary">
              <div>
                <p className="text-[11px] font-orbitron uppercase tracking-[0.25em] text-gundam-text-primary">{t('auth.login.remember')}</p>
                <p className="mt-1 text-xs font-rajdhani text-gundam-text-muted">{t('auth.login.rememberHint')}</p>
              </div>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-gundam-border bg-gundam-bg-secondary text-gundam-cyan focus:ring-gundam-cyan/50"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary group flex w-full items-center justify-center gap-2 border-none py-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {t('auth.login.submit')} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-rajdhani text-gundam-text-secondary">
            {t('auth.login.newPilot')}{' '}
            <Link to="/register" className="font-bold text-gundam-cyan hover:underline">
              {t('auth.login.enlist')}
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between px-2 text-[10px] font-orbitron uppercase tracking-[0.2em] opacity-30">
          <span>Ver. 2.0.4.UC</span>
          <span>{t('auth.login.status')}</span>
          <span>Port 5173</span>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
