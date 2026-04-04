import { useEffect, useState } from 'react'
import { BarChart3, Boxes, PackageSearch, Rocket, ShoppingBag } from 'lucide-react'
import sellerService from '../../services/sellerService'

const SellerDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await sellerService.getDashboard()
        setDashboard(data)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <div className="pt-32 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-[0.3em]">Initializing seller command grid...</div>
  }

  const overview = dashboard?.overview || {}

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-orbitron text-white uppercase tracking-tight">Seller Command Deck</h1>
          <p className="mt-2 text-gundam-text-muted font-rajdhani uppercase tracking-[0.35em] text-xs">
            Revenue, inventory and deployment telemetry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard label="Revenue" value={`$${(overview.totalRevenue || 0).toLocaleString()}`} icon={<BarChart3 size={18} />} />
          <StatCard label="Orders" value={overview.totalOrders || 0} icon={<ShoppingBag size={18} />} />
          <StatCard label="Products" value={overview.totalProducts || 0} icon={<Boxes size={18} />} />
          <StatCard label="Stock Units" value={overview.totalStock || 0} icon={<Rocket size={18} />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <section className="glass-card border-gundam-border/30 p-6">
            <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-6">Top-selling units</h2>
            <div className="space-y-4">
              {(dashboard?.topProducts || []).length === 0 ? (
                <EmptySellerBlock text="No completed sales yet. Stock your armory and deploy your first wave." />
              ) : dashboard.topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4 rounded-xl border border-gundam-border/20 bg-black/20 p-4">
                  <div className="w-14 h-14 rounded-lg bg-gundam-bg-tertiary border border-gundam-border/20 overflow-hidden p-1 flex items-center justify-center">
                    {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-contain" /> : <PackageSearch size={18} className="text-gundam-cyan" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-orbitron uppercase tracking-tight">{product.name}</p>
                    <p className="text-gundam-text-muted text-xs uppercase tracking-widest mt-1">Units sold: {product.soldUnits}</p>
                  </div>
                  <p className="text-gundam-cyan font-orbitron">${(product.revenue || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card border-gundam-border/30 p-6">
            <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-6">Recent seller orders</h2>
            <div className="space-y-4">
              {(dashboard?.recentOrders || []).length === 0 ? (
                <EmptySellerBlock text="No seller order feed available yet." />
              ) : dashboard.recentOrders.map((order) => (
                <div key={order._id} className="rounded-xl border border-gundam-border/20 bg-black/20 p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <p className="text-white font-orbitron uppercase tracking-tight">{order.customer?.displayName || 'Unknown Pilot'}</p>
                      <p className="mt-1 text-gundam-text-muted text-xs uppercase tracking-widest">{order.customer?.email || 'No comm channel'}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded border border-gundam-cyan/30 text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest">{order.status}</span>
                      <p className="mt-2 text-gundam-cyan font-orbitron">${(order.sellerRevenue || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gundam-text-secondary text-sm">{order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass-card border-gundam-border/30 p-6 mt-8">
          <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-6">Inventory grid</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gundam-text-muted font-orbitron border-b border-gundam-border/20">
                  <th className="pb-4">Unit</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Stock</th>
                  <th className="pb-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.products || []).map((product) => (
                  <tr key={product._id} className="border-b border-gundam-border/10">
                    <td className="py-4 text-white font-orbitron uppercase tracking-tight">{product.name}</td>
                    <td className="py-4 text-gundam-text-secondary">{product.category?.name || 'Unknown category'}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded border border-gundam-cyan/20 text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest">{product.status}</span>
                    </td>
                    <td className="py-4 text-gundam-text-secondary">{product.stock}</td>
                    <td className="py-4 text-right text-gundam-cyan font-orbitron">${product.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, icon }) => (
  <div className="glass-card border-gundam-border/30 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">{label}</p>
        <p className="mt-3 text-3xl font-orbitron text-white">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-gundam-cyan/10 border border-gundam-cyan/20 text-gundam-cyan flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
)

const EmptySellerBlock = ({ text }) => (
  <div className="rounded-xl border border-dashed border-gundam-border/30 p-8 text-center text-gundam-text-muted">
    {text}
  </div>
)

export default SellerDashboardPage
