import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Repeat, 
  Activity, 
  Settings, 
  ShieldAlert, 
  ArrowUpRight,
  UserCheck,
  Package,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to retrieve strategic intelligence.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="pt-32 text-center text-gundam-red font-orbitron animate-pulse">Accessing Command Center...</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-orbitron text-white uppercase tracking-tighter glow-text-red italic">
            TACTICAL COMMAND CENTER
          </h1>
          <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.4em] mt-2 flex items-center gap-2 italic">
            <span className="w-2 h-2 bg-gundam-red rounded-full animate-ping" /> System Authorization: LEVEL 10 ADMIN
          </p>
        </div>
        <div className="flex gap-4 self-start lg:self-auto">
           <button className="p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all text-white">
              <Settings size={20} />
           </button>
           <button className="p-3 bg-gundam-red/20 border border-gundam-red/50 rounded hover:bg-gundam-red/30 transition-all text-gundam-red">
              <ShieldAlert size={20} />
           </button>
        </div>
      </div>

      {/* Main HUD Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AdminStatCard 
          label="Total Registered Pilots" 
          value={stats?.overview.totalPilots || 0} 
          icon={<Users size={24} />} 
          color="text-gundam-cyan"
          trend="+12% this cycle"
        />
        <AdminStatCard 
          label="Total Fleet Revenue" 
          value={`$${stats?.overview.totalRevenue.toLocaleString() || 0}`} 
          icon={<ShoppingBag size={24} />} 
          color="text-gundam-emerald"
          trend="+5.4% efficiency"
        />
        <AdminStatCard 
          label="Active Trade Missions" 
          value={stats?.overview.activeMissions || 0} 
          icon={<Repeat size={24} />} 
          color="text-gundam-amber"
          trend="Stable"
        />
        <AdminStatCard 
          label="System Integrity" 
          value={stats?.overview.systemUptime || '99.9%'} 
          icon={<Activity size={24} />} 
          color="text-gundam-red"
          trend="Nominal"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity Stream */}
        <div className="xl:col-span-2 space-y-6">
           <div className="bg-gundam-dark-surface/50 border border-white/10 p-6 rounded-lg backdrop-blur-md">
              <h3 className="text-xl font-orbitron text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                 <BarChart3 size={20} className="text-gundam-cyan" /> Recent Deployment Activity
              </h3>
              
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left font-rajdhani">
                   <thead>
                      <tr className="border-b border-white/10 text-[10px] font-orbitron text-gundam-text-muted uppercase tracking-widest">
                         <th className="pb-4">Pilot</th>
                         <th className="pb-4">Mission ID</th>
                         <th className="pb-4">Resources</th>
                         <th className="pb-4">Status</th>
                         <th className="pb-4 text-right">Sync</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {stats?.recentActivity.map((order) => (
                        <tr key={order._id} className="group hover:bg-white/5 transition-all text-sm">
                           <td className="py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-gundam-cyan/20 border border-gundam-cyan/30 flex items-center justify-center font-orbitron text-xs">
                                    {order.user?.displayName[0]}
                                 </div>
                                 <div>
                                    <div className="text-white font-bold">{order.user?.displayName}</div>
                                    <div className="text-[10px] text-gundam-text-muted uppercase">{order.user?.email}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 font-mono text-gundam-cyan opacity-80 uppercase text-xs">
                              {order._id.slice(-8)}
                           </td>
                           <td className="py-4 text-white font-bold">
                              ${order.totalAmount.toLocaleString()}
                           </td>
                           <td className="py-4">
                              <span className={`text-[9px] font-orbitron px-2 py-0.5 rounded border ${
                                order.status === 'DELIVERED' ? 'text-gundam-emerald border-gundam-emerald/40 bg-gundam-emerald/5' :
                                order.status === 'CANCELLED' ? 'text-gundam-red border-gundam-red/40 bg-gundam-red/5' :
                                'text-gundam-amber border-gundam-amber/40 bg-gundam-amber/5'
                              } uppercase`}>
                                {order.status}
                              </span>
                           </td>
                           <td className="py-4 text-right text-gundam-text-muted text-[10px]">
                              {new Date(order.createdAt).toLocaleDateString()}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>

              <div className="space-y-4 md:hidden">
                {stats?.recentActivity.map((order) => (
                  <div key={order._id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-white font-bold truncate">{order.user?.displayName}</p>
                        <p className="text-[10px] text-gundam-text-muted uppercase truncate">{order.user?.email}</p>
                      </div>
                      <span className="text-[9px] text-gundam-text-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-gundam-cyan font-mono uppercase">{order._id.slice(-8)}</span>
                      <span className="text-white font-bold">${order.totalAmount.toLocaleString()}</span>
                    </div>
                    <span className={`mt-3 inline-flex text-[9px] font-orbitron px-2 py-1 rounded border ${
                      order.status === 'DELIVERED' ? 'text-gundam-emerald border-gundam-emerald/40 bg-gundam-emerald/5' :
                      order.status === 'CANCELLED' ? 'text-gundam-red border-gundam-red/40 bg-gundam-red/5' :
                      'text-gundam-amber border-gundam-amber/40 bg-gundam-amber/5'
                    } uppercase`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Sidebar: Admin Quick Actions */}
        <div className="space-y-6">
           <div className="bg-gundam-dark-surface/50 border border-gundam-red/20 p-6 rounded-lg backdrop-blur-md">
              <h3 className="text-lg font-orbitron text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                 <ShieldAlert size={18} className="text-gundam-red" /> Operational Control
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <AdminQuickAction to="/admin/products" icon={<Package size={16} />} label="Manage Armory (Products)" color="bg-gundam-cyan/10 text-gundam-cyan hover:bg-gundam-cyan/20" />
                 <AdminQuickAction to="/admin/categories" icon={<LayoutGrid size={16} />} label="Protocol Categories" color="bg-gundam-cyan/10 text-gundam-cyan hover:bg-gundam-cyan/20" />
                 <AdminQuickAction to="/admin/users" icon={<UserCheck size={16} />} label="Pilot Authorization" color="bg-gundam-emerald/10 text-gundam-emerald hover:bg-gundam-emerald/20" />
                 <AdminQuickAction to="/admin/orders" icon={<ShoppingBag size={16} />} label="Deployment Orders" color="bg-gundam-emerald/10 text-gundam-emerald hover:bg-gundam-emerald/20" />
                 <AdminQuickAction to="/admin/trades" icon={<Repeat size={16} />} label="Oversee Missions" color="bg-gundam-amber/10 text-gundam-amber hover:bg-gundam-amber/20" />
                 <AdminQuickAction to="/admin/reports" icon={<ShieldAlert size={16} />} label="Violation Reports" color="bg-gundam-red/10 text-gundam-red hover:bg-gundam-red/20" />
              </div>
           </div>

           {/* System Health HUD */}
           <div className="bg-black/40 border border-white/5 p-6 rounded-lg">
              <h4 className="text-[10px] font-orbitron text-gundam-text-muted uppercase tracking-[0.3em] mb-4">Reactor Core Health</h4>
              <div className="space-y-4">
                 <HealthBar label="CPU Load" percent={45} color="bg-gundam-cyan" />
                 <HealthBar label="Memory Unit" percent={62} color="bg-gundam-amber" />
                 <HealthBar label="Signal Latency" percent={12} color="bg-gundam-emerald" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ label, value, icon, color, trend }) => (
  <div className="bg-gundam-dark-surface/80 border border-white/5 p-6 rounded-lg relative overflow-hidden group hover:border-white/20 transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
       {icon}
    </div>
    <span className="text-[9px] font-orbitron text-gundam-text-muted uppercase tracking-widest block mb-1">{label}</span>
    <div className={`text-3xl font-orbitron text-white mb-2`}>{value}</div>
    <div className="flex items-center gap-1 text-[9px] font-orbitron uppercase tracking-tighter opacity-60">
       <ArrowUpRight size={12} className="text-gundam-emerald" /> {trend}
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: '100%' }}
         transition={{ duration: 1.5, ease: "easeOut" }}
         className={`h-full opacity-30 ${color.replace('text-', 'bg-')}`}
       />
    </div>
  </div>
);

const AdminQuickAction = ({ icon, label, color, to }) => (
  <Link to={to} className={`w-full p-4 rounded border border-transparent transition-all flex items-center justify-between font-orbitron text-[10px] uppercase tracking-widest ${color}`}>
     <div className="flex items-center gap-3">
        {icon} {label}
     </div>
     <ChevronRight size={14} />
  </Link>
);

const HealthBar = ({ label, percent, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[8px] font-orbitron text-gundam-text-muted uppercase">
       <span>{label}</span>
       <span>{percent}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
       <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        className={`h-full ${color}`}
       />
    </div>
  </div>
);

export default AdminDashboard;
