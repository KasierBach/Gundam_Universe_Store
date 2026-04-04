import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import tradeService from '../../services/tradeService'
import useAuthStore from '../../stores/authStore'
import { useI18n } from '../../i18n/I18nProvider'

const TradeMarketPage = () => {
  const { t, tv } = useI18n()
  const [listings, setListings] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const [data, suggestionData] = await Promise.all([
          tradeService.getListings(),
          isAuthenticated ? tradeService.getSuggestions({ limit: 4 }) : Promise.resolve([]),
        ])
        setListings(data?.results || [])
        setSuggestions(suggestionData || [])
      } catch (err) {
        setError(t('trade.market.error'))
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [isAuthenticated, t])

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-gundam-darker px-4 pb-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="glow-text mb-4 text-4xl font-orbitron text-gundam-cyan md:text-5xl">
          {t('trade.market.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-gundam-text-secondary">
          {t('trade.market.description')}
        </p>
      </motion.div>

      {error && (
        <div className="mb-8 border border-gundam-red bg-gundam-red/20 p-4 text-center text-sm font-orbitron uppercase tracking-widest text-gundam-red">
          {error}
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="mb-10 rounded-2xl border border-gundam-cyan/20 bg-gundam-dark-surface/60 p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-orbitron uppercase tracking-widest text-gundam-cyan">{t('trade.market.suggestedTitle')}</h2>
              <p className="max-w-2xl text-sm text-gundam-text-secondary">{t('trade.market.suggestedDescription')}</p>
            </div>
            <span className="text-[10px] font-orbitron uppercase tracking-[0.25em] text-gundam-text-muted">{t('trade.market.adaptiveGrid')}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {suggestions.map((item) => (
              <Link key={`suggestion-${item._id}`} to={`/trade/${item._id}`} className="rounded-xl border border-gundam-cyan/20 bg-black/20 p-4 transition-all hover:border-gundam-cyan/50">
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 font-orbitron uppercase tracking-tight text-white">{item.title}</p>
                  <span className="rounded border border-gundam-cyan/20 px-2 py-1 text-[9px] font-orbitron uppercase text-gundam-cyan">Score {item.suggestionScore}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-gundam-text-secondary">{item.wantedItems}</p>
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-gundam-text-muted">
                  <span>{tv('condition', item.condition)}</span>
                  <span>{item.owner?.displayName || t('trade.market.unknownPilot')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 border-b border-gundam-cyan/30 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <button className="border border-gundam-cyan bg-gundam-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gundam-cyan transition-all duration-300 hover:bg-gundam-cyan hover:text-black">
            {t('trade.market.filterAll')}
          </button>
        </div>
        <Link
          to="/trade/new"
          className="clip-path-mech w-full bg-gundam-red px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(255,50,50,0.5)] transition-all duration-300 hover:bg-gundam-red-hover sm:w-auto"
        >
          {t('trade.market.postTrade')}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-96 animate-pulse rounded-lg border border-gundam-cyan/10 bg-gundam-dark-surface" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gundam-cyan/10 py-20 text-center">
          <p className="mb-4 font-orbitron uppercase tracking-widest text-gundam-text-secondary">{t('trade.market.noSignals')}</p>
          <Link to="/trade/new" className="font-bold text-gundam-cyan underline transition-all hover:glow-text">
            {t('trade.market.beFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border border-gundam-cyan/20 bg-gundam-dark-surface shadow-lg transition-all duration-500 hover:border-gundam-cyan/60"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1589118949245-7d48d24bc04b?q=80&w=600'}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute right-4 top-4 border border-gundam-cyan bg-black/80 px-3 py-1 text-[10px] font-orbitron uppercase tracking-tighter text-gundam-cyan">
                  {tv('condition', item.condition)}
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-2 truncate text-xl font-orbitron text-white transition-colors group-hover:text-gundam-cyan">
                  {item.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gundam-text-secondary">
                  {item.description}
                </p>
                <div className="mb-4 border-l-2 border-gundam-cyan bg-black/40 p-3">
                  <span className="mb-1 block text-[10px] uppercase text-gundam-cyan">{t('trade.market.lookingFor')}</span>
                  <p className="truncate text-xs text-white">{item.wantedItems || t('trade.market.openNegotiation')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs italic text-gundam-text-secondary">{t('trade.market.by')} {item.owner?.displayName || t('trade.market.unknownPilot')}</span>
                  <Link
                    to={`/trade/${item._id}`}
                    className="border border-gundam-cyan/50 px-4 py-2 text-xs font-bold uppercase text-gundam-cyan transition-all hover:bg-gundam-cyan/20"
                  >
                    {t('trade.market.viewDetails')}
                  </Link>
                </div>
              </div>

              <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-gundam-cyan opacity-40 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-gundam-cyan opacity-40 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TradeMarketPage
