import { useEffect, useState } from 'react'
import { PackageCheck } from 'lucide-react'
import adminService from '../../services/adminService'
import orderService from '../../services/orderService'

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadOrders = async () => {
    try {
      const data = await adminService.getOrders()
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId)
      await orderService.updateOrderStatus(orderId, status)
      await loadOrders()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter">Order Control</h1>
        <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.3em] text-xs mt-2">Monitor deployment status across all active pilots</p>
      </div>

      <div className="glass-card border-gundam-border/30 p-6">
        {loading ? (
          <div className="p-10 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Syncing deployment records...</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gundam-border/20 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">
                    <th className="pb-4">Ref</th>
                    <th className="pb-4">Pilot</th>
                    <th className="pb-4">Items</th>
                    <th className="pb-4">Total</th>
                    <th className="pb-4">Created</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gundam-border/10">
                      <td className="py-4 text-white font-orbitron text-xs uppercase">{order._id.slice(-8)}</td>
                      <td className="py-4">
                        <div className="text-white">{order.user?.displayName || 'Unknown Pilot'}</div>
                        <div className="text-xs text-gundam-text-muted">{order.user?.email || 'No signal'}</div>
                      </td>
                      <td className="py-4 text-gundam-text-secondary text-sm">{order.items.length}</td>
                      <td className="py-4 text-gundam-cyan font-orbitron">${order.totalAmount.toLocaleString()}</td>
                      <td className="py-4 text-gundam-text-secondary text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <OrderStatusSelect order={order} updatingId={updatingId} onChange={handleStatusChange} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {orders.map((order) => (
                <div key={order._id} className="rounded-xl border border-gundam-border/20 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-orbitron text-sm uppercase">{order._id.slice(-8)}</p>
                      <p className="mt-2 text-white">{order.user?.displayName || 'Unknown Pilot'}</p>
                      <p className="text-xs text-gundam-text-muted truncate">{order.user?.email || 'No signal'}</p>
                    </div>
                    <span className="text-xs text-gundam-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gundam-text-muted">Items</p>
                      <p className="text-gundam-text-secondary">{order.items.length}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gundam-text-muted">Total</p>
                      <p className="text-gundam-cyan font-orbitron">${order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <OrderStatusSelect order={order} updatingId={updatingId} onChange={handleStatusChange} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const OrderStatusSelect = ({ order, updatingId, onChange }) => (
  <div className="flex items-center gap-3">
    <PackageCheck size={16} className="text-gundam-cyan" />
    <select
      value={order.status}
      disabled={updatingId === order._id}
      onChange={(event) => onChange(order._id, event.target.value)}
      className="w-full bg-black/40 border border-gundam-border/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gundam-cyan"
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  </div>
)

export default OrderManagementPage
