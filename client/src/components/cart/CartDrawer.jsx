import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import useCartStore from '../../stores/cartStore';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a192f] border-l border-cyan-500/30 z-[60] shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col pointer-events-auto"
          >
            {/* Header - Tactical HUD Style */}
            <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between bg-cyan-950/20">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="text-cyan-400 text-xl" />
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Cart Status</h2>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {totalItems} UNITS
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                  <FiShoppingCart size={48} className="animate-pulse" />
                  <p className="text-sm uppercase tracking-[0.2em]">Deployment Queue Empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.product?._id}
                      className="group relative p-3 bg-[#112240] border border-cyan-500/10 hover:border-cyan-500/30 transition-all rounded-lg"
                    >
                      <div className="flex gap-4">
                        {/* Unit Image */}
                        <div className="w-20 h-20 bg-black/50 rounded overflow-hidden flex-shrink-0 border border-cyan-500/5 group-hover:border-cyan-500/20 transition-colors">
                          <img 
                            src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'} 
                            alt={item.product?.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Unit Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-cyan-500 font-bold text-sm truncate uppercase tracking-wider">
                            {item.product?.name}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 uppercase italic">
                            {item.product?.grade} | {item.product?.series}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            {/* Quantity Control */}
                            <div className="flex items-center gap-3 bg-black/30 rounded px-2 py-1 border border-white/5">
                              <button 
                                onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                                className="text-gray-500 hover:text-cyan-400 transition-colors"
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="text-sm font-mono text-cyan-100 min-w-[20px] text-center">
                                {String(item.quantity).padStart(2, '0')}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                                className="text-gray-500 hover:text-cyan-400 transition-colors"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                            
                            <span className="text-white font-mono text-sm tracking-tighter">
                              ${(item.product?.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Simple Delete Button */}
                        <button 
                          onClick={() => removeFromCart(item.product?._id)}
                          className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all shadow-lg scale-90 hover:scale-100"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary - Tactical Checkout */}
            <div className="p-6 bg-[#112240] border-t border-cyan-500/30 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-cyan-400/60 uppercase tracking-widest">
                  <span>Tax (Included)</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-2 flex justify-between items-end border-t border-white/5">
                  <span className="text-sm font-bold text-gray-300 uppercase italic">Power Required</span>
                  <span className="text-2xl font-mono font-bold text-white tracking-tighter">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                disabled={items.length === 0}
                className="w-full py-4 bg-cyan-500 text-[#000814] font-black uppercase tracking-[0.3em] rounded border-b-4 border-cyan-700 hover:bg-cyan-400 active:border-b-0 active:mt-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-3 group"
              >
                PROCEED TO DEPLOYMENT
                <span className="w-2 h-2 rounded-full bg-black group-hover:animate-ping" />
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/cart');
                }}
                className="w-full py-3 border border-cyan-500/30 text-cyan-400 font-orbitron text-[10px] uppercase tracking-[0.25em] rounded hover:bg-cyan-500/10 transition-all"
              >
                OPEN FULL CART
              </button>
              
              <p className="text-[10px] text-center text-gray-500 uppercase tracking-[0.2em] italic">
                Scanning for supply routes and pilot verification...
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
