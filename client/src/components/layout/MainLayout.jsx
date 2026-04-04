import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { motion, AnimatePresence } from 'framer-motion'

const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="z-10 py-8 border-t border-gundam-border/30 bg-gundam-bg-secondary/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gundam-cyan rounded rotate-45 flex items-center justify-center">
              <span className="text-gundam-bg-primary font-bold -rotate-45">G</span>
            </div>
            <span className="font-orbitron font-bold tracking-tighter text-gundam-cyan">GUNDAM UNIVERSE</span>
          </div>
          <p className="text-gundam-text-secondary text-sm font-rajdhani">
            © {new Date().getFullYear()} UC ERA - PILOT AUTHENTICATION SYSTEM
          </p>
          <div className="flex gap-4">
            {['Facebook', 'Twitter', 'Github'].map((link) => (
              <a key={link} href="#" className="text-gundam-text-muted hover:text-gundam-cyan transition-colors text-sm">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
