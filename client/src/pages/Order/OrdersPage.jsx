import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiCalendar, FiDollarSign, FiClock, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import useOrderStore from '../../stores/orderStore';
import { Link } from 'react-router-dom';
import ModelKitImage from '../../components/shared/ModelKitImage';

const OrdersPage = () => {
  const { orders, fetchOrders, loading } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      'PROCESSING': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      'SHIPPED': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      'DELIVERED': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      'CANCELLED': 'text-red-400 bg-red-400/10 border-red-400/30',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gundam-bg-primary gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <span className="font-orbitron text-xs tracking-widest text-cyan-500 opacity-50 uppercase italic">Retrieving Mission Logs...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-gundam-bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <h1 className="text-4xl font-black font-orbitron tracking-tighter text-white uppercase italic">Mission Logs</h1>
             <p className="text-gray-500 font-rajdhani text-sm uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" /> Synchronized with Command Center
             </p>
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
             Total Deployments: {String(orders.length).padStart(2, '0')}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center glass-card border-dashed border-cyan-500/20">
            <FiPackage size={64} className="text-gray-600 mb-6 opacity-30" />
            <h2 className="text-xl font-orbitron font-bold text-gray-500 uppercase tracking-widest">No Registered Deployments</h2>
            <p className="mt-4 text-gray-600 font-rajdhani mb-8">Start your first mission today from the shop.</p>
            <Link to="/shop" className="btn btn-primary px-8">ACCESS TACTICAL SHOP</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative glass-card p-6 border-white/10 hover:border-cyan-500/30 transition-all bg-[#0a192f]/60 overflow-hidden"
              >
                {/* Decorative background grid */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                  {/* Status & ID */}
                  <div className="lg:w-1/4 space-y-3">
                     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-orbitron border font-bold uppercase tracking-[0.2em] ${getStatusColor(order.status)}`}>
                        {order.status}
                     </div>
                     <div className="text-xs font-mono text-gray-400">
                        REF: <span className="text-cyan-400 uppercase">{order._id.slice(-12)}</span>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] text-gray-500 font-orbitron uppercase">
                        <FiCalendar className="text-cyan-400/50" /> {new Date(order.createdAt).toLocaleDateString()}
                     </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex-1">
                     <div className="flex flex-wrap gap-3">
                        {order.items.slice(0, 3).map((item, i) => (
                           <div key={i} className="w-12 h-12 rounded bg-black/40 border border-white/5 p-1 relative group/img overflow-hidden">
                              <ModelKitImage src={item.image} alt={item.name} name={item.name} grade={item.grade} series={item.series} />
                              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                           </div>
                        ))}
                        {order.items.length > 3 && (
                           <div className="w-12 h-12 rounded bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400 italic">
                             +{order.items.length - 3}
                           </div>
                        )}
                     </div>
                     {/* Textual summary */}
                     <p className="mt-3 text-xs text-gray-400 uppercase tracking-widest font-bold font-rajdhani line-clamp-1">
                        {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                     </p>
                  </div>

                  {/* Summary & Price */}
                  <div className="lg:w-1/4 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 flex flex-row lg:flex-col justify-between lg:items-end gap-4">
                     <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-orbitron italic mb-1 text-right">Power Consumed</div>
                        <div className="text-2xl font-mono font-bold text-white tracking-widest">${order.totalAmount.toLocaleString()}</div>
                     </div>
                     <Link to={`/orders/${order._id}`} className="px-6 py-2 border border-cyan-500/30 text-cyan-400 text-[10px] uppercase font-orbitron tracking-widest rounded hover:bg-cyan-500 hover:text-black transition-all group flex items-center gap-2">
                        View Details <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
