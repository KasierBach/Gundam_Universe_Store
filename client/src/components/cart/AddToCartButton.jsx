import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import useCartStore from '../../stores/cartStore';
import useAuthStore from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';

const AddToCartButton = ({ productId, quantity = 1, disabled = false, className = "" }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { items, addToCart, loading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useI18n();

  // Check if this product is already in the cart
  const isInCart = items.some(item => 
    (item.product?._id?.toString() === productId?.toString()) || 
    (item.product?.toString() === productId?.toString())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return navigate('/login');
    }

    if (isInCart) {
      // Logic could be to open cart or do nothing
      return;
    }

    await addToCart(productId, quantity);
    setIsAdded(true);
    
    // Reset temporary animation state after 2 seconds, 
    // but the button will stay in "IN CART" mode because of isInCart check
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      disabled={disabled || loading}
      className={`group relative overflow-hidden flex items-center justify-center gap-2 py-2 px-4 rounded font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
        (isAdded || isInCart)
          ? "bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
      } ${disabled ? "opacity-30 cursor-not-allowed grayscale" : ""} ${className}`}
    >
      <AnimatePresence mode="wait">
        {(isAdded || isInCart) ? (
          <motion.div
            key="added"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <FiCheck size={16} />
            <span>{isAdded ? t('product.actions.deployed') : t('product.actions.inCart')}</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <FiShoppingCart size={16} className={loading ? "animate-bounce" : ""} />
            <span>{loading ? t('product.actions.linking') : t('product.actions.addUnit')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
    </motion.button>
  );
};

export default AddToCartButton;
