import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShieldAlert, ShoppingCart, Trash2 } from 'lucide-react'
import useCartStore from '../../stores/cartStore'
import ModelKitImage from '../../components/shared/ModelKitImage'

const CartPage = () => {
  const {
    items,
    totalItems,
    totalPrice,
    loading,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gundam-border/20 pb-8">
          <div>
            <h1 className="text-4xl font-orbitron text-white uppercase tracking-tight">Supply Cart</h1>
            <p className="mt-2 text-gundam-text-muted font-rajdhani uppercase tracking-[0.35em] text-xs">
              Tactical inventory staged for deployment
            </p>
          </div>
          <div className="text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan">
            Units queued: {String(totalItems).padStart(2, '0')}
          </div>
        </div>

        {items.length === 0 && !loading ? (
          <div className="glass-card border-dashed border-gundam-cyan/20 p-16 text-center">
            <ShoppingCart size={54} className="mx-auto text-gundam-cyan/40 mb-6" />
            <h2 className="text-2xl font-orbitron text-white uppercase tracking-tight">No units in queue</h2>
            <p className="mt-3 text-gundam-text-secondary font-rajdhani">Load your next mobile suit purchase from the tactical armory.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 mt-8 btn btn-primary px-8 py-3">
              Return to shop <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.8fr] gap-8">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product?._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="glass-card border-gundam-border/30 p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-28 h-28 bg-gundam-bg-tertiary border border-gundam-border/30 rounded-lg overflow-hidden flex items-center justify-center p-2">
                      <ModelKitImage
                        src={item.product?.images?.[0]?.url}
                        alt={item.product?.name}
                        name={item.product?.name}
                        grade={item.product?.grade}
                        series={item.product?.series}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <Link to={`/products/${item.product?.slug}`} className="text-white font-orbitron text-lg uppercase tracking-tight hover:text-gundam-cyan">
                            {item.product?.name}
                          </Link>
                          <p className="mt-1 text-gundam-text-muted text-xs uppercase tracking-widest">
                            {item.product?.grade} | {item.product?.series} | {item.product?.condition}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product?._id)}
                          className="inline-flex items-center gap-2 text-gundam-red text-xs font-orbitron uppercase tracking-widest hover:text-white"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-lg border border-gundam-border/30 overflow-hidden bg-black/30">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                            className="px-4 py-3 hover:bg-white/5 text-gundam-text-secondary"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-5 py-3 font-orbitron text-sm text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                            className="px-4 py-3 hover:bg-white/5 text-gundam-text-secondary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest text-gundam-text-muted">Unit total</p>
                          <p className="text-2xl font-orbitron text-gundam-cyan">
                            ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <aside className="glass-card border-gundam-border/30 p-6 h-fit sticky top-24">
              <h2 className="text-lg font-orbitron text-white uppercase tracking-widest">Deployment Summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-gundam-text-secondary uppercase tracking-widest text-[10px]">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between text-gundam-text-secondary uppercase tracking-widest text-[10px]">
                  <span>Shipping</span>
                  <span className="text-gundam-emerald">Free</span>
                </div>
                <div className="pt-4 border-t border-gundam-border/20 flex justify-between items-end">
                  <span className="text-white font-orbitron uppercase tracking-widest text-xs">Total Power</span>
                  <span className="text-3xl font-orbitron text-gundam-cyan">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="mt-8 w-full btn btn-primary py-4 flex items-center justify-center gap-2">
                Proceed to checkout <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full py-3 border border-gundam-red/40 text-gundam-red font-orbitron text-xs uppercase tracking-widest hover:bg-gundam-red/10 transition-all rounded-lg"
              >
                Clear cart
              </button>

              <div className="mt-6 flex items-start gap-3 rounded-lg border border-gundam-amber/20 bg-gundam-amber/5 p-4">
                <ShieldAlert size={18} className="text-gundam-amber mt-0.5" />
                <p className="text-xs text-gundam-text-secondary leading-relaxed">
                  Stock is reserved only after successful checkout. High-rarity units may sell out during pilot confirmation.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
