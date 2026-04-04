import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import useAuthStore from '../../stores/authStore'

const LoginPage = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(email, password, { rememberMe })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gundam-cyan/5 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gundam-cyan/10 border border-gundam-cyan/30 mb-6 shadow-cyan-glow"
          >
            <ShieldCheck size={32} className="text-gundam-cyan" />
          </motion.div>
          <h2 className="text-3xl font-orbitron font-black tracking-widest text-gundam-text-primary">PILOT LOGIN</h2>
          <p className="text-gundam-text-secondary mt-2 font-rajdhani uppercase tracking-widest text-xs">Authorization Level: Required</p>
        </div>

        <div className="glass-card p-8 border-gundam-border/50 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gundam-cyan/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gundam-red/10 border border-gundam-red/50 text-gundam-red-glow text-sm p-4 rounded-lg flex items-start gap-3"
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-orbitron tracking-widest text-gundam-text-secondary uppercase">Encoded Identifier (Email)</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted group-focus-within:text-gundam-cyan transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="pilot@uc-era.com"
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan focus:ring-1 focus:ring-gundam-cyan/30 transition-all font-rajdhani"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-orbitron tracking-widest text-gundam-text-secondary uppercase">Access Key (Password)</label>
                <Link to="/forgot-password" size={14} className="text-[10px] font-orbitron text-gundam-cyan hover:underline uppercase">Lost Key?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted group-focus-within:text-gundam-cyan transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan focus:ring-1 focus:ring-gundam-cyan/30 transition-all font-rajdhani"
                />
              </div>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-gundam-border/60 bg-gundam-bg-tertiary/70 px-4 py-3 text-sm text-gundam-text-secondary">
              <div>
                <p className="font-orbitron text-[11px] uppercase tracking-[0.25em] text-gundam-text-primary">Remember Login</p>
                <p className="mt-1 font-rajdhani text-xs text-gundam-text-muted">Keep your pilot email and session ready on this device.</p>
              </div>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gundam-border bg-gundam-bg-secondary text-gundam-cyan focus:ring-gundam-cyan/50"
              />
            </label>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 group border-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  INITIALIZE SESSION <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gundam-text-secondary font-rajdhani text-sm">
            NEW PILOT? <Link to="/register" className="text-gundam-cyan font-bold hover:underline">ENLIST HERE</Link>
          </p>
        </div>

        {/* Tactical Deco */}
        <div className="mt-8 flex justify-between items-center px-2 opacity-30 text-[10px] font-orbitron uppercase tracking-[0.2em]">
          <span>Ver. 2.0.4.UC</span>
          <span>Status: Secure</span>
          <span>Port 5173</span>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
