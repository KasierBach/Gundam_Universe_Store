import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import useAuthStore from '../../stores/authStore'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const [error, setError] = useState('')
  
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
            <UserPlus size={32} className="text-gundam-cyan" />
          </motion.div>
          <h2 className="text-3xl font-orbitron font-black tracking-widest text-gundam-text-primary uppercase">Pilot Enlistment</h2>
          <p className="text-gundam-text-secondary mt-2 font-rajdhani uppercase tracking-widest text-xs">New Unit Authentication</p>
        </div>

        <div className="glass-card p-8 border-gundam-border/50 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gundam-cyan/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-[10px] font-orbitron tracking-widest text-gundam-text-secondary uppercase">Mission Display Name</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted group-focus-within:text-gundam-cyan transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  placeholder="Pilot Name"
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan focus:ring-1 focus:ring-gundam-cyan/30 transition-all font-rajdhani"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron tracking-widest text-gundam-text-secondary uppercase">Encoded Identifier (Email)</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted group-focus-within:text-gundam-cyan transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="pilot@uc-era.com"
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan focus:ring-1 focus:ring-gundam-cyan/30 transition-all font-rajdhani"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron tracking-widest text-gundam-text-secondary uppercase">Access Key (Password)</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted group-focus-within:text-gundam-cyan transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan focus:ring-1 focus:ring-gundam-cyan/30 transition-all font-rajdhani"
                />
              </div>
            </div>

            <div className="space-y-2 pb-2">
              <label className="text-[10px] font-orbitron tracking-widest text-gundam-text-secondary uppercase">Verify Access Key</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-text-muted group-focus-within:text-gundam-cyan transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gundam-bg-tertiary border border-gundam-border text-gundam-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-gundam-cyan focus:ring-1 focus:ring-gundam-cyan/30 transition-all font-rajdhani"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 group border-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  INITIALIZE PILOT AUTH <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gundam-text-secondary font-rajdhani text-sm uppercase">
            ALREADY ENLISTED? <Link to="/login" className="text-gundam-cyan font-bold hover:underline">ACCESS TERMINAL</Link>
          </p>
        </div>

        {/* Tactical Deco */}
        <div className="mt-8 flex justify-between items-center px-4 opacity-30 text-[10px] font-orbitron uppercase tracking-[0.2em]">
          <span>Ver. 2.0.4.UC</span>
          <span>Status: Secure</span>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
