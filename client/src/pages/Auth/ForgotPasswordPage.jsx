import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, AlertCircle, ShieldQuestion } from 'lucide-react'
import authService from '../../services/authService'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      setLoading(true)
      const result = await authService.forgotPassword(email)
      setSuccess(result.message)
      setResetToken(result.resetToken || '')
    } catch (error) {
      setError(error.response?.data?.message || 'Reset protocol initialization failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_55%)] -z-10" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gundam-cyan/10 border border-gundam-cyan/30 mb-6 shadow-cyan-glow">
            <ShieldQuestion size={30} className="text-gundam-cyan" />
          </div>
          <h1 className="text-3xl font-orbitron font-black tracking-widest text-gundam-text-primary">RESET ACCESS</h1>
          <p className="text-gundam-text-secondary mt-2 font-rajdhani uppercase tracking-widest text-xs">Password recovery protocol</p>
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
              <div className="bg-gundam-cyan/10 border border-gundam-cyan/30 text-gundam-text-primary text-sm p-4 rounded-lg space-y-2">
                <p>{success}</p>
                {resetToken ? (
                  <p className="text-xs font-mono break-all text-gundam-cyan">Demo reset token: {resetToken}</p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-xs font-orbitron tracking-widest text-gundam-text-secondary uppercase">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan transition-all font-rajdhani"
                  placeholder="pilot@uc-era.com"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 border-none">
              {loading ? 'SYNCING...' : 'SEND RESET LINK'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center mt-8 text-gundam-text-secondary font-rajdhani text-sm">
            Remembered it? <Link to="/login" className="text-gundam-cyan font-bold hover:underline">Return to login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
