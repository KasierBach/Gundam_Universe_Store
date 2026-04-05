import { useEffect, useState } from 'react'
import { BarChart3, Boxes, PackageSearch, Rocket, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import sellerService from '../../services/sellerService'
import { useI18n } from '../../i18n/I18nProvider'
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy'

const SellerDashboardPage = () => {
  const { locale } = useI18n()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      loading: 'Đang khởi tạo bảng seller...',
      title: 'BẢNG ĐIỀU KHIỂN SELLER',
      subtitle: 'Doanh thu, tồn kho và tín hiệu triển khai',
      actions: {
        products: 'Quản lý sản phẩm',
        orders: 'Xem đơn hàng',
      },
      stats: ['Doanh thu', 'Đơn hàng', 'Sản phẩm', 'Tổng tồn kho'],
      topTitle: 'Sản phẩm bán tốt',
      noSales: 'Chưa có đơn hoàn tất. Hãy bổ sung kho và triển khai đợt bán đầu tiên.',
      soldUnits: 'Đã bán',
      recentOrders: 'Đơn hàng gần đây',
      noOrders: 'Chưa có dữ liệu đơn hàng seller.',
      unknownPilot: 'Người dùng chưa xác định',
      noComms: 'Chưa có kênh liên hệ',
      inventory: 'Lưới tồn kho',
      headers: ['Sản phẩm', 'Danh mục', 'Trạng thái', 'Tồn kho', 'Giá'],
      unknownCategory: 'Danh mục chưa xác định',
      stock: 'Tồn kho',
      tradeMonitor: 'Theo dõi tín hiệu giao dịch',
      tradeLink: 'Mở nhật ký giao dịch',
      noTrades: 'Chưa có tin trao đổi nào. Hãy đăng listing để tăng tương tác sưu tầm.',
    }
    : {
      loading: 'Initializing seller command grid...',
      title: 'Seller Command Deck',
      subtitle: 'Revenue, inventory and deployment telemetry',
      actions: {
        products: 'Manage Products',
        orders: 'Review Orders',
      },
      stats: ['Revenue', 'Orders', 'Products', 'Stock Units'],
      topTitle: 'Top-selling units',
      noSales: 'No completed sales yet. Stock your armory and deploy your first wave.',
      soldUnits: 'Units sold',
      recentOrders: 'Recent seller orders',
      noOrders: 'No seller order feed available yet.',
      unknownPilot: 'Unknown Pilot',
      noComms: 'No comm channel',
      inventory: 'Inventory grid',
      headers: ['Unit', 'Category', 'Status', 'Stock', 'Price'],
      unknownCategory: 'Unknown category',
      stock: 'Stock',
      tradeMonitor: 'Trade Signal Monitor',
      tradeLink: 'Open trade logs',
      noTrades: 'No trade missions logged yet. Launch a listing to build collector traction.',
    });

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
    return <div className="pt-32 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-[0.3em]">{copy.loading}</div>
  }

  const overview = dashboard?.overview || {}
  const getStatusLabel = (status) => {
    if (locale !== 'vi') return status

    const labels = {
      PENDING: 'Chờ xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    }

    return labels[status] || status
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-orbitron text-white uppercase tracking-tight">{copy.title}</h1>
          <p className="mt-2 text-gundam-text-muted font-rajdhani uppercase tracking-[0.35em] text-xs">
            {copy.subtitle}
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link to="/seller/products" className="inline-flex items-center justify-center rounded-lg border border-gundam-cyan/30 bg-gundam-cyan/10 px-5 py-3 text-[10px] font-orbitron uppercase tracking-[0.25em] text-gundam-cyan hover:bg-gundam-cyan/20 transition-all">
              {copy.actions.products}
            </Link>
            <Link to="/seller/orders" className="inline-flex items-center justify-center rounded-lg border border-gundam-border/40 bg-black/20 px-5 py-3 text-[10px] font-orbitron uppercase tracking-[0.25em] text-white hover:border-gundam-cyan/30 transition-all">
              {copy.actions.orders}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard label={copy.stats[0]} value={`$${(overview.totalRevenue || 0).toLocaleString()}`} icon={<BarChart3 size={18} />} />
          <StatCard label={copy.stats[1]} value={overview.totalOrders || 0} icon={<ShoppingBag size={18} />} />
          <StatCard label={copy.stats[2]} value={overview.totalProducts || 0} icon={<Boxes size={18} />} />
          <StatCard label={copy.stats[3]} value={overview.totalStock || 0} icon={<Rocket size={18} />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <section className="glass-card border-gundam-border/30 p-6">
            <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-6">{copy.topTitle}</h2>
            <div className="space-y-4">
              {(dashboard?.topProducts || []).length === 0 ? (
                <EmptySellerBlock text={copy.noSales} />
              ) : dashboard.topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4 rounded-xl border border-gundam-border/20 bg-black/20 p-4">
                  <div className="w-14 h-14 rounded-lg bg-gundam-bg-tertiary border border-gundam-border/20 overflow-hidden p-1 flex items-center justify-center">
                    {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-contain" /> : <PackageSearch size={18} className="text-gundam-cyan" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-orbitron uppercase tracking-tight">{product.name}</p>
                    <p className="text-gundam-text-muted text-xs uppercase tracking-widest mt-1">{copy.soldUnits}: {product.soldUnits}</p>
                  </div>
                  <p className="text-gundam-cyan font-orbitron">${(product.revenue || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card border-gundam-border/30 p-6">
            <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-6">{copy.recentOrders}</h2>
            <div className="space-y-4">
              {(dashboard?.recentOrders || []).length === 0 ? (
                <EmptySellerBlock text={copy.noOrders} />
              ) : dashboard.recentOrders.map((order) => (
                <div key={order._id} className="rounded-xl border border-gundam-border/20 bg-black/20 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <p className="text-white font-orbitron uppercase tracking-tight">{order.customer?.displayName || copy.unknownPilot}</p>
                      <p className="mt-1 text-gundam-text-muted text-xs uppercase tracking-widest">{order.customer?.email || copy.noComms}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="px-3 py-1 rounded border border-gundam-cyan/30 text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest">{getStatusLabel(order.status)}</span>
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
          <h2 className="text-lg font-orbitron text-white uppercase tracking-widest mb-6">{copy.inventory}</h2>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gundam-text-muted font-orbitron border-b border-gundam-border/20">
                  <th className="pb-4">{copy.headers[0]}</th>
                  <th className="pb-4">{copy.headers[1]}</th>
                  <th className="pb-4">{copy.headers[2]}</th>
                  <th className="pb-4">{copy.headers[3]}</th>
                  <th className="pb-4 text-right">{copy.headers[4]}</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.products || []).map((product) => (
                  <tr key={product._id} className="border-b border-gundam-border/10">
                    <td className="py-4 text-white font-orbitron uppercase tracking-tight">{product.name}</td>
                    <td className="py-4 text-gundam-text-secondary">{product.category?.name || copy.unknownCategory}</td>
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

          <div className="space-y-4 md:hidden">
            {(dashboard?.products || []).map((product) => (
              <div key={product._id} className="rounded-xl border border-gundam-border/20 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white font-orbitron uppercase tracking-tight">{product.name}</p>
                    <p className="mt-1 text-xs text-gundam-text-muted">{product.category?.name || copy.unknownCategory}</p>
                  </div>
                  <span className="px-3 py-1 rounded border border-gundam-cyan/20 text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest">{product.status}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gundam-text-secondary">{copy.stock}: {product.stock}</span>
                  <span className="text-gundam-cyan font-orbitron">${product.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card border-gundam-border/30 p-6 mt-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-orbitron text-white uppercase tracking-widest">{copy.tradeMonitor}</h2>
            <Link to="/profile/trades" className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-gundam-cyan hover:underline">{copy.tradeLink}</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(dashboard?.recentTrades || []).length === 0 ? (
              <div className="md:col-span-2 xl:col-span-4">
                <EmptySellerBlock text={copy.noTrades} />
              </div>
            ) : dashboard.recentTrades.map((trade) => (
              <div key={trade._id} className="rounded-xl border border-gundam-border/20 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-orbitron uppercase tracking-tight line-clamp-2">{trade.title}</p>
                    <p className="mt-2 text-[10px] text-gundam-text-muted uppercase tracking-[0.2em]">{trade.condition}</p>
                  </div>
                  <span className="rounded border border-gundam-cyan/20 px-2 py-1 text-[9px] font-orbitron uppercase tracking-widest text-gundam-cyan">{trade.status}</span>
                </div>
                <p className="mt-3 text-sm text-gundam-text-secondary line-clamp-2">{trade.wantedItems}</p>
              </div>
            ))}
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
