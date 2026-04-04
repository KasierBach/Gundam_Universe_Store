import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ShoppingCart, Menu, X, LogOut, MessageSquare, Repeat, Shield, Heart, LayoutDashboard, Bell, AlertOctagon } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import useNotificationStore from '../../stores/notificationStore'
import CartDrawer from '../cart/CartDrawer'
import { cn } from '../../utils/cn'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { totalItems, fetchCart } = useCartStore()
  const { unreadCount, fetchNotifications, isLoaded } = useNotificationStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const navigate = useNavigate()

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

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Trade Hub', path: '/trade' },
    { name: 'Orders', path: '/orders', auth: true },
    { name: 'Wishlist', path: '/wishlist', auth: true },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-gundam-bg-primary/80 backdrop-blur-md border-b border-gundam-border/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            className="w-10 h-10 bg-gundam-cyan rounded flex items-center justify-center relative overflow-hidden"
            whileHover={{ rotate: 90 }}
          >
            <span className="text-gundam-bg-primary font-black text-xl z-10 -rotate-45">G</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </motion.div>
          <span className="font-orbitron font-bold tracking-tighter text-xl hidden sm:block text-gundam-cyan">
            GUNDAM UNIVERSE
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks
            .filter((link) => !link.auth || isAuthenticated)
            .map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => cn(
                "font-orbitron font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:text-gundam-cyan",
                isActive ? "text-gundam-cyan glow-text" : "text-gundam-text-secondary"
              )}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative group p-2 text-gundam-text-secondary hover:text-gundam-cyan transition-all"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-gundam-red text-[10px] flex items-center justify-center rounded-full text-white font-bold animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated && (
            <>
              <Link to="/notifications" className="relative group p-2 text-gundam-text-secondary hover:text-gundam-cyan transition-all" title="Notification Center">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gundam-cyan text-[10px] flex items-center justify-center rounded-full text-black font-bold shadow-cyan-glow">
                    {Math.min(unreadCount, 9)}
                  </span>
                )}
              </Link>
              <Link to="/chat" className="relative group p-2 text-gundam-text-secondary hover:text-gundam-cyan transition-all" title="Chat Console">
                <MessageSquare size={20} />
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4 border-l border-gundam-border/30 pl-4 relative group">
              <div className="flex items-center gap-3 cursor-pointer py-2">
                <Link to="/profile" className="flex items-center gap-2 group/avatar">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="Profile" className="w-8 h-8 rounded-full border border-gundam-cyan/30 group-hover/avatar:border-gundam-cyan transition-colors" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gundam-bg-tertiary flex items-center justify-center border border-gundam-cyan/30 group-hover/avatar:border-gundam-cyan transition-colors">
                      <User size={16} />
                    </div>
                  )}
                  <span className="font-orbitron text-xs text-gundam-text-primary group-hover/avatar:text-gundam-cyan transition-colors">
                    {user?.displayName}
                  </span>
                </Link>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-1 w-48 bg-gundam-bg-primary border border-gundam-border/30 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] backdrop-blur-xl">
                 <div className="p-2 space-y-1">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                       <User size={14} /> Deck Profile
                    </Link>
                    <Link to="/profile/trades" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                       <Repeat size={14} /> My Missions
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-red hover:bg-white/5 transition-all rounded">
                         <Shield size={14} /> Admin Console
                      </Link>
                    )}
                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                       <ShoppingCart size={14} /> Deployments
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                       <Heart size={14} /> Favorites
                    </Link>
                    {(user?.role === 'seller' || user?.role === 'admin') && (
                      <>
                        <Link to="/seller/dashboard" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                           <LayoutDashboard size={14} /> Seller Deck
                        </Link>
                        <Link to="/seller/products" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                           <Shield size={14} /> Seller Products
                        </Link>
                        <Link to="/seller/orders" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                           <ShoppingCart size={14} /> Seller Orders
                        </Link>
                      </>
                    )}
                    <Link to="/notifications" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-secondary hover:text-gundam-cyan hover:bg-white/5 transition-all rounded">
                       <Bell size={14} /> Alerts
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/reports" className="flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-red hover:bg-white/5 transition-all rounded">
                         <AlertOctagon size={14} /> Reports
                      </Link>
                    )}
                    <div className="h-px bg-gundam-border/30 my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted hover:text-gundam-red hover:bg-white/5 transition-all rounded"
                    >
                      <LogOut size={14} /> Logoff
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-outline text-[10px] border-cyan/30 px-4 py-1.5 rounded">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-[10px] px-4 py-1.5 rounded">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gundam-text-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu & Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gundam-border/30 bg-gundam-bg-primary overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-6">
              {navLinks.filter((link) => !link.auth || isAuthenticated).map((link) => (
                <Link 
                  key={link.name} 
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
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline w-full text-center">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center">Register</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                    <User size={20} /> Profile
                  </Link>
                  <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                    <Heart size={20} /> Wishlist
                  </Link>
                  <Link to="/notifications" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                    <Bell size={20} /> Notifications
                  </Link>
                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                        <LayoutDashboard size={20} /> Seller Deck
                      </Link>
                      <Link to="/seller/products" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                        <Shield size={20} /> Seller Products
                      </Link>
                      <Link to="/seller/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                        <ShoppingCart size={20} /> Seller Orders
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin/reports" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gundam-text-secondary">
                      <AlertOctagon size={20} /> Reports
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-4 text-gundam-text-secondary hover:text-gundam-red">
                    <LogOut size={20} /> Logout
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

export default Navbar
