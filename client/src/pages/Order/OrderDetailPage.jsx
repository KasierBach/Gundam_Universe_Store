import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Clock3, Package, Truck } from 'lucide-react'
import useOrderStore from '../../stores/orderStore'
import ModelKitImage from '../../components/shared/ModelKitImage'

const ORDER_STAGES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const OrderDetailPage = () => {
  const { id } = useParams()
  const { currentOrder, fetchOrderDetail, loading, resetCurrentOrder } = useOrderStore()

  useEffect(() => {
    fetchOrderDetail(id)

    return () => {
      resetCurrentOrder()
    }
  }, [fetchOrderDetail, id, resetCurrentOrder])

  if (loading || !currentOrder) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gundam-bg-primary">
        <div className="text-center">
          <Clock3 className="mx-auto text-gundam-cyan animate-pulse" size={48} />
          <p className="mt-4 text-gundam-cyan font-orbitron text-xs uppercase tracking-[0.3em]">Syncing mission log...</p>
        </div>
      </div>
    )
  }

  const currentStageIndex = Math.max(ORDER_STAGES.indexOf(currentOrder.status), 0)

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted mb-8">
          <Link to="/orders" className="hover:text-gundam-cyan">Mission logs</Link>
          <ChevronRight size={12} />
          <span className="text-gundam-cyan">Deployment {currentOrder._id.slice(-8)}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          <section className="glass-card border-gundam-border/30 p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-orbitron text-white uppercase tracking-tight">Deployment Tracking</h1>
                <p className="mt-2 text-gundam-text-muted text-xs uppercase tracking-[0.3em]">
                  Reference: {currentOrder._id}
                </p>
              </div>
              <span className="px-4 py-2 rounded border border-gundam-cyan/30 text-gundam-cyan font-orbitron text-[10px] uppercase tracking-widest">
                {currentOrder.status}
              </span>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
              {ORDER_STAGES.map((stage, index) => {
                const completed = index <= currentStageIndex
                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`rounded-xl border p-5 ${completed ? 'border-gundam-cyan/30 bg-gundam-cyan/5' : 'border-gundam-border/20 bg-black/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 && <Clock3 size={18} className={completed ? 'text-gundam-cyan' : 'text-gundam-text-muted'} />}
                      {index === 1 && <Package size={18} className={completed ? 'text-gundam-cyan' : 'text-gundam-text-muted'} />}
                      {index === 2 && <Truck size={18} className={completed ? 'text-gundam-cyan' : 'text-gundam-text-muted'} />}
                      {index === 3 && <CheckCircle2 size={18} className={completed ? 'text-gundam-cyan' : 'text-gundam-text-muted'} />}
                      <span className={`font-orbitron text-[11px] uppercase tracking-widest ${completed ? 'text-white' : 'text-gundam-text-muted'}`}>
                        {stage}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-5">Loaded Units</h2>
              <div className="space-y-4">
                {currentOrder.items.map((item, index) => (
                  <div key={`${item.product}-${index}`} className="flex flex-col sm:flex-row gap-4 border border-gundam-border/20 rounded-xl p-4 bg-black/20">
                    <div className="w-20 h-20 rounded-lg bg-gundam-bg-tertiary border border-gundam-border/20 overflow-hidden p-2 flex items-center justify-center">
                      <ModelKitImage src={item.image} alt={item.name} name={item.name} grade={item.grade} series={item.series} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-orbitron uppercase tracking-tight">{item.name}</h3>
                      <p className="mt-1 text-gundam-text-muted text-xs uppercase tracking-widest">
                        {item.grade} | {item.series} | {item.condition}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-gundam-text-muted text-[10px] uppercase tracking-widest">Qty {item.quantity}</p>
                      <p className="mt-2 text-gundam-cyan font-orbitron text-lg">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="glass-card border-gundam-border/30 p-6">
              <h2 className="text-lg font-orbitron text-white uppercase tracking-widest">Shipping Data</h2>
              <div className="mt-5 space-y-3 text-sm text-gundam-text-secondary">
                <p><span className="text-gundam-text-muted uppercase text-[10px] tracking-widest">Pilot</span><br />{currentOrder.shippingAddress.fullName}</p>
                <p><span className="text-gundam-text-muted uppercase text-[10px] tracking-widest">Phone</span><br />{currentOrder.shippingAddress.phone}</p>
                <p><span className="text-gundam-text-muted uppercase text-[10px] tracking-widest">Drop zone</span><br />{currentOrder.shippingAddress.address}, {currentOrder.shippingAddress.city}</p>
              </div>
            </div>

            <div className="glass-card border-gundam-border/30 p-6">
              <h2 className="text-lg font-orbitron text-white uppercase tracking-widest">Payment Status</h2>
              <div className="mt-5 space-y-3 text-sm text-gundam-text-secondary">
                <p><span className="text-gundam-text-muted uppercase text-[10px] tracking-widest">Method</span><br />{currentOrder.paymentInfo?.method}</p>
                <p><span className="text-gundam-text-muted uppercase text-[10px] tracking-widest">Status</span><br />{currentOrder.paymentInfo?.status}</p>
                <p><span className="text-gundam-text-muted uppercase text-[10px] tracking-widest">Total power</span><br /><span className="text-gundam-cyan font-orbitron text-2xl">${currentOrder.totalAmount.toLocaleString()}</span></p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
