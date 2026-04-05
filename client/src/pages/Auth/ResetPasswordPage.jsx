import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import authService from '../../services/authService'
import { useI18n } from '../../i18n/I18nProvider'
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy'

const ResetPasswordPage = () => {
  const { locale } = useI18n()
  const [searchParams] = useSearchParams()
  const tokenFromQuery = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [token, setToken] = useState(tokenFromQuery)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      error: 'Không thể đặt lại mật khẩu.',
      title: 'KHÓA TRUY CẬP MỚI',
      subtitle: 'Hoàn tất quy trình đặt lại mật khẩu',
      token: 'Mã xác nhận',
      newPassword: 'Mật khẩu mới',
      confirm: 'Xác nhận mật khẩu',
      updating: 'ĐANG CẬP NHẬT...',
      submit: 'ĐẶT LẠI MẬT KHẨU',
      back: 'Quay lại',
      login: 'đăng nhập',
    }
    : {
      error: 'Reset execution failed.',
      title: 'NEW ACCESS KEY',
      subtitle: 'Finalize password reset',
      token: 'Reset Token',
      newPassword: 'New Password',
      confirm: 'Confirm Password',
      updating: 'UPDATING...',
      submit: 'RESET PASSWORD',
      back: 'Back to',
      login: 'login',
    })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      setLoading(true)
      const result = await authService.resetPassword({ token, newPassword, confirmNewPassword })
      setSuccess(result.message)
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      setError(error.response?.data?.message || copy.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08),transparent_55%)] -z-10" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gundam-red/10 border border-gundam-red/30 mb-6 shadow-red-glow">
            <ShieldCheck size={30} className="text-gundam-red" />
          </div>
          <h1 className="text-3xl font-orbitron font-black tracking-widest text-gundam-text-primary">{copy.title}</h1>
          <p className="text-gundam-text-secondary mt-2 font-rajdhani uppercase tracking-widest text-xs">{copy.subtitle}</p>
        </div>

        <div className="glass-card p-8 border-gundam-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="bg-gundam-red/10 border border-gundam-red/50 text-gundam-red-glow text-sm p-4 rounded-lg flex gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            ) : null}

            {success ? (
              <div className="bg-gundam-cyan/10 border border-gundam-cyan/30 text-gundam-text-primary text-sm p-4 rounded-lg">
                <p>{success}</p>
              </div>
            ) : null}

            <AuthField label={copy.token} value={token} onChange={setToken} />
            <PasswordField label={copy.newPassword} value={newPassword} onChange={setNewPassword} />
            <PasswordField label={copy.confirm} value={confirmNewPassword} onChange={setConfirmNewPassword} />

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 border-none">
              {loading ? copy.updating : copy.submit}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center mt-8 text-gundam-text-secondary font-rajdhani text-sm">
            {copy.back} <Link to="/login" className="text-gundam-cyan font-bold hover:underline">{copy.login}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

const AuthField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-xs font-orbitron tracking-widest text-gundam-text-secondary uppercase">{label}</label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
      className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary px-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan transition-all font-mono text-sm"
    />
  </div>
)

const PasswordField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-xs font-orbitron tracking-widest text-gundam-text-secondary uppercase">{label}</label>
    <div className="relative">
      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted" />
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan transition-all font-rajdhani"
      />
    </div>
  </div>
)

export default ResetPasswordPage
