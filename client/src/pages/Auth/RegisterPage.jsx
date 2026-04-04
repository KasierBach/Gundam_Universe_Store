import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, User, UserPlus } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import { useI18n } from '../../i18n/I18nProvider'

const RegisterPage = () => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  })
  const [error, setError] = useState('')

  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError(t('auth.register.mismatch'))
    }

    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || t('auth.register.error'))
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-12 pt-24">
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
            <UserPlus size={32} className="text-gundam-cyan" />
          </motion.div>
          <h2 className="font-orbitron text-3xl font-black uppercase tracking-widest text-gundam-text-primary">{t('auth.register.title')}</h2>
          <p className="mt-2 font-rajdhani text-xs uppercase tracking-widest text-gundam-text-secondary">{t('auth.register.subtitle')}</p>
        </div>

        <div className="glass-card relative border-gundam-border/50 p-8">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-gundam-cyan/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Field
              label={t('auth.register.displayName')}
              icon={<User size={18} />}
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Pilot Name"
            />

            <Field
              label={t('auth.register.email')}
              icon={<Mail size={18} />}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="pilot@uc-era.com"
            />

            <Field
              label={t('auth.register.password')}
              icon={<Lock size={18} />}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <Field
              label={t('auth.register.confirmPassword')}
              icon={<Lock size={18} />}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary group flex w-full items-center justify-center gap-2 border-none py-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {t('auth.register.submit')} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-rajdhani uppercase text-gundam-text-secondary">
            {t('auth.register.already')}{' '}
            <Link to="/login" className="font-bold text-gundam-cyan hover:underline">
              {t('auth.register.access')}
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between px-4 text-[10px] font-orbitron uppercase tracking-[0.2em] opacity-30">
          <span>Ver. 2.0.4.UC</span>
          <span>{t('auth.register.status')}</span>
        </div>
      </motion.div>
    </div>
  )
}

const Field = ({ label, icon, type = 'text', name, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary">{label}</label>
    <div className="group relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted transition-colors group-focus-within:text-gundam-cyan">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full rounded-lg border border-gundam-border bg-gundam-bg-tertiary py-3 pl-10 pr-4 font-rajdhani text-gundam-text-primary transition-all focus:border-gundam-cyan focus:outline-none focus:ring-1 focus:ring-gundam-cyan/30"
      />
    </div>
  </div>
)

export default RegisterPage
