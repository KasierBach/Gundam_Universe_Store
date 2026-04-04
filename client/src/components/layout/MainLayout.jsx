import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import { useI18n } from '../../i18n/I18nProvider'

const MainLayout = () => {
  const { t } = useI18n()

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />

      <main className="z-10 flex-grow">
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

      <footer className="z-10 border-t border-gundam-border/30 bg-gundam-bg-secondary/50 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gundam-cyan rotate-45">
              <span className="-rotate-45 font-bold text-gundam-bg-primary">G</span>
            </div>
            <div>
              <span className="block font-orbitron font-bold tracking-tighter text-gundam-cyan">{t('navbar.brand')}</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-gundam-text-muted">
                {t('layout.footerTagline')}
              </span>
            </div>
          </div>
          <p className="text-sm text-gundam-text-secondary font-rajdhani">
            © {new Date().getFullYear()} UC ERA
          </p>
          <div className="flex gap-4">
            {[t('layout.socials.facebook'), t('layout.socials.twitter'), t('layout.socials.github')].map((link) => (
              <a key={link} href="#" className="text-sm text-gundam-text-muted transition-colors hover:text-gundam-cyan">
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
