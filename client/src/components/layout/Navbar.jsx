import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertOctagon,
  Bell,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Repeat,
  Shield,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import useNotificationStore from '../../stores/notificationStore'
import CartDrawer from '../cart/CartDrawer'
import { cn } from '../../utils/cn'
import { useI18n } from '../../i18n/I18nProvider'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { totalItems, fetchCart } = useCartStore()
  const { unreadCount, fetchNotifications, isLoaded } = useNotificationStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { locale, setLocale, t } = useI18n()

  const navLinks = useMemo(
    () => [
      { name: t('navbar.links.shop'), path: '/shop' },
      { name: t('navbar.links.trade'), path: '/trade' },
      { name: t('navbar.links.orders'), path: '/orders', auth: true },
      { name: t('navbar.links.wishlist'), path: '/wishlist', auth: true },
    ],
    [t]
  )

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
      if (!isLoaded) {
        fetchNotifications()
      }
    }
  }, [fetchCart, fetchNotifications, isAuthenticated, isLoaded])

  useEffect(() => {
    setIsOpen(false)
    setIsCartOpen(false)
  }, [location.pathname])

  return (
    <nav className="fixed left-0 top-0 z-[100] w-full border-b border-gundam-border/30 bg-gundam-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2">
          <motion.div
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-gundam-cyan"
            whileHover={{ rotate: 90 }}
          >
            <span className="z-10 -rotate-45 text-xl font-black text-gundam-bg-primary">G</span>
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
          </motion.div>
          <span className="hidden font-orbitron text-xl font-bold tracking-tighter text-gundam-cyan sm:block">
            {t('navbar.brand')}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks
            .filter((link) => !link.auth || isAuthenticated)
            .map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'font-orbitron text-sm font-medium uppercase tracking-widest transition-all duration-300 hover:text-gundam-cyan',
                    isActive ? 'glow-text text-gundam-cyan' : 'text-gundam-text-secondary'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <LocaleSwitch locale={locale} setLocale={setLocale} t={t} />

          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative p-2 text-gundam-text-secondary transition-all hover:text-gundam-cyan"
            aria-label={t('navbar.links.orders')}
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gundam-red text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated && (
            <>
              <Link
                to="/notifications"
                className="group relative p-2 text-gundam-text-secondary transition-all hover:text-gundam-cyan"
                title={t('navbar.notifications')}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gundam-cyan text-[10px] font-bold text-black shadow-cyan-glow">
                    {Math.min(unreadCount, 9)}
                  </span>
                )}
              </Link>
              <Link
                to="/chat"
                className="group relative p-2 text-gundam-text-secondary transition-all hover:text-gundam-cyan"
                title={t('navbar.chat')}
              >
                <MessageSquare size={20} />
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="group relative hidden items-center gap-4 border-l border-gundam-border/30 pl-4 md:flex">
              <div className="flex cursor-pointer items-center gap-3 py-2">
                <Link to="/profile" className="group/avatar flex items-center gap-2">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={t('navbar.profile')}
                      className="h-8 w-8 rounded-full border border-gundam-cyan/30 transition-colors group-hover/avatar:border-gundam-cyan"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gundam-cyan/30 bg-gundam-bg-tertiary transition-colors group-hover/avatar:border-gundam-cyan">
                      <User size={16} />
                    </div>
                  )}
                  <span className="font-orbitron text-xs text-gundam-text-primary transition-colors group-hover/avatar:text-gundam-cyan">
                    {user?.displayName}
                  </span>
                </Link>
              </div>

              <div className="invisible absolute right-0 top-full z-[110] mt-1 w-52 rounded border border-gundam-border/30 bg-gundam-bg-primary opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="space-y-1 p-2">
                  <MenuLink to="/profile" icon={<User size={14} />} onClick={() => {}}>
                    {t('navbar.profile')}
                  </MenuLink>
                  <MenuLink to="/profile/trades" icon={<Repeat size={14} />} onClick={() => {}}>
                    {t('navbar.missions')}
                  </MenuLink>
                  {user?.role === 'admin' && (
                    <MenuLink to="/admin" icon={<Shield size={14} />} className="text-gundam-red" onClick={() => {}}>
                      {t('navbar.admin')}
                    </MenuLink>
                  )}
                  <MenuLink to="/orders" icon={<ShoppingCart size={14} />} onClick={() => {}}>
                    {t('navbar.deployments')}
                  </MenuLink>
                  <MenuLink to="/wishlist" icon={<Heart size={14} />} onClick={() => {}}>
                    {t('navbar.favorites')}
                  </MenuLink>
                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <>
                      <MenuLink to="/seller/dashboard" icon={<LayoutDashboard size={14} />} onClick={() => {}}>
                        {t('navbar.sellerDeck')}
                      </MenuLink>
                      <MenuLink to="/seller/products" icon={<Shield size={14} />} onClick={() => {}}>
                        {t('navbar.sellerProducts')}
                      </MenuLink>
                      <MenuLink to="/seller/orders" icon={<ShoppingCart size={14} />} onClick={() => {}}>
                        {t('navbar.sellerOrders')}
                      </MenuLink>
                    </>
                  )}
                  <MenuLink to="/notifications" icon={<Bell size={14} />} onClick={() => {}}>
                    {t('navbar.alerts')}
                  </MenuLink>
                  {user?.role === 'admin' && (
                    <MenuLink to="/admin/reports" icon={<AlertOctagon size={14} />} className="text-gundam-red" onClick={() => {}}>
                      {t('navbar.reports')}
                    </MenuLink>
                  )}
                  <div className="my-1 h-px bg-gundam-border/30" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted transition-all hover:bg-white/5 hover:text-gundam-red"
                  >
                    <LogOut size={14} /> {t('navbar.logout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-outline rounded px-4 py-1.5 text-[10px] border-cyan/30">
                {t('navbar.login')}
              </Link>
              <Link to="/register" className="btn-primary rounded px-4 py-1.5 text-[10px]">
                {t('navbar.register')}
              </Link>
            </div>
          )}

          <button className="p-2 text-gundam-text-secondary md:hidden" onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gundam-border/30 bg-gundam-bg-primary md:hidden"
          >
            <div className="flex flex-col gap-6 px-4 py-6">
              <div className="flex items-center justify-between rounded-2xl border border-gundam-border/30 bg-black/20 p-3">
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-muted">{t('common.language')}</p>
                  <p className="mt-1 text-sm font-orbitron font-bold uppercase text-white">
                    {locale === 'vi' ? t('common.vietnamese') : t('common.english')}
                  </p>
                </div>
                <LocaleSwitch locale={locale} setLocale={setLocale} t={t} compact />
              </div>

              {navLinks
                .filter((link) => !link.auth || isAuthenticated)
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="font-orbitron text-lg tracking-widest text-gundam-text-secondary hover:text-gundam-cyan"
                  >
                    {link.name}
                  </Link>
                ))}
              <div className="h-px bg-gundam-border/30" />
              {!isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline w-full text-center">
                    {t('navbar.login')}
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center">
                    {t('navbar.register')}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <MobileLink to="/profile" icon={<User size={20} />} label={t('navbar.profile')} onClick={() => setIsOpen(false)} />
                  <MobileLink to="/wishlist" icon={<Heart size={20} />} label={t('navbar.favorites')} onClick={() => setIsOpen(false)} />
                  <MobileLink to="/notifications" icon={<Bell size={20} />} label={t('navbar.alerts')} onClick={() => setIsOpen(false)} />
                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <>
                      <MobileLink to="/seller/dashboard" icon={<LayoutDashboard size={20} />} label={t('navbar.sellerDeck')} onClick={() => setIsOpen(false)} />
                      <MobileLink to="/seller/products" icon={<Shield size={20} />} label={t('navbar.sellerProducts')} onClick={() => setIsOpen(false)} />
                      <MobileLink to="/seller/orders" icon={<ShoppingCart size={20} />} label={t('navbar.sellerOrders')} onClick={() => setIsOpen(false)} />
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <MobileLink to="/admin/reports" icon={<AlertOctagon size={20} />} label={t('navbar.reports')} onClick={() => setIsOpen(false)} />
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-4 text-gundam-text-secondary hover:text-gundam-red">
                    <LogOut size={20} /> {t('navbar.logout')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const LocaleSwitch = ({ locale, setLocale, t, compact = false }) => (
  <div className={cn('flex items-center rounded-full border border-gundam-border/30 bg-black/20 p-1', compact && 'scale-95')}>
    <button
      onClick={() => setLocale('vi')}
      className={cn(
        'rounded-full px-3 py-1 text-[10px] font-orbitron uppercase tracking-[0.24em] transition-all',
        locale === 'vi' ? 'bg-gundam-cyan text-gundam-bg-primary shadow-cyan-glow' : 'text-gundam-text-muted hover:text-gundam-cyan'
      )}
      aria-label={t('common.vietnamese')}
    >
      VI
    </button>
    <button
      onClick={() => setLocale('en')}
      className={cn(
        'rounded-full px-3 py-1 text-[10px] font-orbitron uppercase tracking-[0.24em] transition-all',
        locale === 'en' ? 'bg-gundam-cyan text-gundam-bg-primary shadow-cyan-glow' : 'text-gundam-text-muted hover:text-gundam-cyan'
      )}
      aria-label={t('common.english')}
    >
      EN
    </button>
  </div>
)

const MenuLink = ({ to, icon, children, className, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 rounded px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary transition-all hover:bg-white/5 hover:text-gundam-cyan',
      className
    )}
  >
    {icon}
    {children}
  </Link>
)

const MobileLink = ({ to, icon, label, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-4 text-gundam-text-secondary">
    {icon}
    {label}
  </Link>
)

export default Navbar
