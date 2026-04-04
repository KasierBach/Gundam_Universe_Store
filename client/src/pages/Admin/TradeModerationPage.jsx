import { useEffect, useState } from 'react'
import { Repeat, ShieldAlert } from 'lucide-react'
import adminService from '../../services/adminService'

const TRADE_STATUSES = ['open', 'in-negotiation', 'completed', 'closed']

const TradeModerationPage = () => {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadTrades = async () => {
    try {
      const data = await adminService.getTrades()
      setTrades(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrades()
  }, [])

  const handleStatusChange = async (tradeId, status) => {
    try {
      setUpdatingId(tradeId)
      await adminService.updateTradeStatus(tradeId, status)
      await loadTrades()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter">Trade Oversight</h1>
        <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.3em] text-xs mt-2">Review trade activity across the hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 p-10 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Mapping trade signals...</div>
        ) : trades.map((trade) => (
          <div key={trade._id} className="glass-card p-6 border-gundam-border/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl text-white font-orbitron uppercase tracking-tight">{trade.title}</h2>
                <p className="text-xs text-gundam-text-muted mt-1">Owner: {trade.owner?.displayName || 'Unknown Pilot'}</p>
              </div>
              <select
                value={trade.status}
                disabled={updatingId === trade._id}
                onChange={(event) => handleStatusChange(trade._id, event.target.value)}
                className="rounded border border-gundam-cyan/30 bg-black/40 px-3 py-2 text-[10px] uppercase font-orbitron text-gundam-cyan focus:outline-none"
              >
                {TRADE_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <p className="text-gundam-text-secondary text-sm mb-4 line-clamp-3">{trade.description}</p>

            <div className="flex items-center justify-between text-xs text-gundam-text-muted">
              <span className="inline-flex items-center gap-2"><Repeat size={14} /> {trade.condition}</span>
              <span className="inline-flex items-center gap-2"><ShieldAlert size={14} /> {new Date(trade.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TradeModerationPage
