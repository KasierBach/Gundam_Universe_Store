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

      <div className="glass-card border-gundam-border/30 p-6 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Syncing deployment records...</div>
        ) : (
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
                    <div className="flex items-center gap-3">
                      <PackageCheck size={16} className="text-gundam-cyan" />
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(event) => handleStatusChange(order._id, event.target.value)}
                        className="bg-black/40 border border-gundam-border/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gundam-cyan"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default OrderManagementPage
