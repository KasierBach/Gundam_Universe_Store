import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import tradeService from '../../services/tradeService'
import useAuthStore from '../../stores/authStore'
import { useI18n } from '../../i18n/I18nProvider'

const TradeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, tv } = useI18n()
  const { user } = useAuthStore()

  const [listing, setListing] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const [offerDescription, setOfferDescription] = useState('')
  const [offerImageFiles, setOfferImageFiles] = useState([])
  const [submittingOffer, setSubmittingOffer] = useState(false)
  const [processingOfferId, setProcessingOfferId] = useState(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [submittingReport, setSubmittingReport] = useState(false)

  const isOwner = user && listing && user._id === listing.owner._id

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const listingData = await tradeService.getListing(id)
        setListing(listingData)

        if (user && user._id === listingData.owner._id) {
          const offersData = await tradeService.getOffers(id)
          setOffers(offersData)
        }
      } catch (err) {
        setError(t('trade.detail.error'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user, t])

  const handleOfferSubmit = async () => {
    if (!offerDescription.trim()) return
    try {
      setSubmittingOffer(true)
      if (offerImageFiles.length === 0) {
        alert(t('trade.detail.attachRequired'))
        return
      }

      const offerData = new FormData()
      offerData.append('offeredItemsDescription', offerDescription)
      offerImageFiles.forEach((file) => {
        offerData.append('images', file)
      })

      const createdOffer = await tradeService.createOffer(id, offerData)
      setShowOfferModal(false)
      setOfferDescription('')
      setOfferImageFiles([])
      navigate(createdOffer?.conversationId ? `/chat?conversation=${createdOffer.conversationId}` : '/chat')
    } catch (err) {
      alert(t('trade.detail.offerFailed'))
    } finally {
      setSubmittingOffer(false)
    }
  }

  const handleUpdateOfferStatus = async (offerId, status) => {
    try {
      setProcessingOfferId(offerId)
      await tradeService.updateOfferStatus(id, offerId, status)

      const listingData = await tradeService.getListing(id)
      const offersData = await tradeService.getOffers(id)
      setListing(listingData)
      setOffers(offersData)

      if (status === 'accepted') {
        alert(t('trade.detail.missionSuccess'))
      }
    } catch (err) {
      alert(t('trade.detail.updateError'))
    } finally {
      setProcessingOfferId(null)
    }
  }

  const handleSubmitReport = async () => {
    if (!reportReason.trim() || !reportDetails.trim()) {
      alert(t('trade.detail.reasonRequired'))
      return
    }

    try {
      setSubmittingReport(true)
      await tradeService.reportListing(id, {
        reason: reportReason,
        details: reportDetails,
      })
      setShowReportModal(false)
      setReportReason('')
      setReportDetails('')
      alert(t('trade.detail.reportSuccess'))
    } catch (err) {
      alert(err.response?.data?.message || t('trade.detail.reportFailed'))
    } finally {
      setSubmittingReport(false)
    }
  }

  if (loading) {
    return <div className="pt-32 text-center font-orbitron animate-pulse text-gundam-cyan">Initializing Data Stream...</div>
  }

  if (error || !listing) {
    return (
      <div className="pt-32 text-center">
        <div className="mb-4 font-orbitron uppercase text-gundam-red">{t('trade.detail.critical')}</div>
        <p className="text-gundam-text-secondary">{error || t('trade.detail.packetLost')}</p>
        <button onClick={() => navigate('/trade')} className="text-glow mt-8 text-xs font-orbitron uppercase text-gundam-cyan underline">
          {t('trade.detail.returnMarket')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="group relative aspect-square overflow-hidden rounded-lg border border-gundam-cyan/30 bg-black shadow-2xl">
            <img src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1589118949245-7d48d24bc04b?q=80&w=900'} alt={listing.title} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className={`${listing.status === 'open' ? 'bg-gundam-red shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gundam-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)]'} skew-x-[-12deg] px-4 py-1 text-[10px] font-orbitron tracking-widest text-white`}>
                {listing.status === 'open' ? t('trade.detail.missionOpen') : t('trade.detail.missionComplete')}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(listing.images || []).map((image, index) => (
              <div key={index} className="aspect-square cursor-pointer overflow-hidden rounded border border-gundam-cyan/20 bg-gundam-dark-surface p-1 transition-all hover:border-gundam-cyan">
                <img src={image.url} alt={`${listing.title}-${index + 1}`} className="h-full w-full object-cover grayscale transition-all hover:grayscale-0" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="relative">
            <div className="mb-2 flex items-center gap-4 text-[10px] font-orbitron tracking-widest text-gundam-cyan">
              <span className="rounded bg-white/5 px-2 py-0.5">SCAN_ID: {listing._id.substring(listing._id.length - 8)}</span>
              <span>|</span>
              <span className="opacity-60">{new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="glow-text mb-4 text-3xl font-orbitron uppercase leading-none tracking-tighter text-white md:text-5xl">
              {listing.title}
            </h1>
            <div className="flex flex-wrap gap-4">
              <span className="border border-gundam-cyan/40 bg-gundam-cyan/5 px-4 py-1 text-[10px] font-orbitron font-bold uppercase tracking-widest text-gundam-cyan">
                {tv('condition', listing.condition)}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-gundam-cyan/20 bg-gundam-dark-surface/80 p-6 shadow-xl backdrop-blur-md">
            <h3 className="mb-4 flex items-center gap-2 text-[10px] font-orbitron uppercase tracking-[0.2em] text-gundam-cyan">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gundam-cyan shadow-[0_0_8px_#00f3ff]" />
              {t('trade.detail.tacticalObjective')}
            </h3>
            <p className="text-2xl font-bold italic tracking-wide text-white font-rajdhani">{listing.wantedItems}</p>
            <div className="absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(#00f3ff1a_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
          </div>

          <div className="space-y-4 border-t border-gundam-cyan/10 pt-6 leading-relaxed text-gundam-text-secondary">
            <h4 className="mb-3 text-[10px] font-orbitron uppercase tracking-[0.3em] text-white opacity-80">{t('trade.detail.decrypt')}</h4>
            <p className="text-lg font-rajdhani">{listing.description}</p>
          </div>

          <div className="flex flex-col gap-4 pt-6 xl:flex-row">
            {isOwner ? (
              <div className="w-full rounded border border-gundam-cyan/30 bg-gundam-cyan/5 p-4 text-center text-xs font-orbitron uppercase tracking-widest italic text-gundam-cyan animate-pulse">
                {t('trade.detail.waiting')}
              </div>
            ) : (
              <>
                <button
                  disabled={listing.status !== 'open'}
                  onClick={() => setShowOfferModal(true)}
                  className="flex-1 bg-gundam-cyan py-4 font-orbitron font-bold uppercase tracking-[0.3em] text-black shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all hover:bg-white disabled:grayscale disabled:opacity-30"
                >
                  {listing.status === 'open' ? t('trade.detail.initiateProposal') : t('trade.detail.sectorClosed')}
                </button>
                <button className="w-full border-2 border-gundam-cyan/40 bg-transparent px-8 py-4 font-orbitron font-bold uppercase tracking-widest text-gundam-cyan transition-all hover:bg-gundam-cyan/10 xl:w-auto">
                  {t('trade.detail.saveMap')}
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full border-2 border-gundam-red/40 bg-transparent px-8 py-4 font-orbitron font-bold uppercase tracking-widest text-gundam-red transition-all hover:bg-gundam-red/10 xl:w-auto"
                >
                  {t('trade.detail.reportListing')}
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-gundam-cyan/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded border border-gundam-cyan/30 bg-gundam-dark-surface font-orbitron text-xl text-gundam-cyan shadow-inner shadow-black">
                {listing.owner?.displayName?.[0] || '?'}
              </div>
              <div>
                <p className="text-xs font-orbitron uppercase tracking-widest text-white">{listing.owner?.displayName || t('trade.market.unknownPilot')}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-tighter text-gundam-text-muted">{t('trade.detail.compatibility')}:</span>
                  <span className="text-xs font-orbitron font-bold text-gundam-cyan">{listing.owner?.reputation?.score || 0}%</span>
                </div>
              </div>
            </div>
            {listing.owner?.address?.city && (
              <div className="text-left sm:text-right">
                <span className="block text-[9px] font-orbitron uppercase text-gundam-text-muted">{t('trade.detail.sectorLock')}</span>
                <span className="text-[10px] font-orbitron text-white">{listing.owner.address.city}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {isOwner && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-24 border-t border-gundam-cyan/20 pt-12"
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-orbitron uppercase tracking-widest text-white">{t('trade.detail.signalStream')}</h2>
              <p className="mt-1 text-[10px] font-orbitron uppercase tracking-[0.2em] text-gundam-cyan opacity-70">{t('trade.detail.signalSubtitle')}</p>
            </div>
            <span className="rounded border border-gundam-cyan/30 bg-gundam-dark-surface px-3 py-1 text-[10px] font-orbitron uppercase text-gundam-cyan">
              {t('trade.detail.activeSignals', { count: offers.length })}
            </span>
          </div>

          {offers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gundam-cyan/10 bg-white/5 py-20 text-center">
              <p className="text-xs font-orbitron uppercase tracking-widest text-gundam-text-secondary opacity-50">{t('trade.detail.noSignals')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <motion.div
                  key={offer._id}
                  whileHover={{ y: -5 }}
                  className={`group relative rounded-lg border p-6 transition-all ${offer.status === 'accepted' ? 'border-gundam-emerald bg-gundam-emerald/5' : 'border-gundam-cyan/20 bg-gundam-dark-surface/50'}`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-gundam-cyan/20 bg-black font-orbitron text-[10px] text-gundam-cyan">
                        {offer.offerer?.displayName?.[0] || '?'}
                      </div>
                      <span className="truncate text-[11px] font-orbitron uppercase tracking-wider text-white">{offer.offerer?.displayName || t('trade.market.unknownPilot')}</span>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[9px] font-orbitron uppercase tracking-tighter ${
                      offer.status === 'accepted' ? 'border border-gundam-emerald text-gundam-emerald' :
                      offer.status === 'rejected' ? 'border border-gundam-red text-gundam-red' :
                      'border border-gundam-cyan text-gundam-cyan opacity-80'
                    }`}>
                      {offer.status}
                    </span>
                  </div>

                  <p className="mb-6 line-clamp-3 text-sm italic leading-relaxed text-gundam-text-secondary font-rajdhani">
                    "{offer.offeredItemsDescription}"
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {offer.status === 'pending' && (
                      <>
                        <button
                          disabled={processingOfferId === offer._id}
                          onClick={() => handleUpdateOfferStatus(offer._id, 'accepted')}
                          className="flex-1 bg-gundam-cyan py-2 text-[10px] font-orbitron font-bold uppercase tracking-widest text-black shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all hover:bg-white disabled:opacity-50"
                        >
                          {t('trade.detail.accept')}
                        </button>
                        <button
                          disabled={processingOfferId === offer._id}
                          onClick={() => handleUpdateOfferStatus(offer._id, 'rejected')}
                          className="flex-1 border border-gundam-red/50 py-2 text-[10px] font-orbitron font-bold uppercase tracking-widest text-gundam-red transition-all hover:bg-gundam-red/10 disabled:opacity-50"
                        >
                          {t('trade.detail.reject')}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate(offer.conversationId ? `/chat?conversation=${offer.conversationId}` : '/chat')}
                      className="flex h-9 w-full items-center justify-center rounded bg-white/10 text-white transition-all hover:bg-white/20 sm:w-12"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute right-0 top-0 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="block translate-y-1 text-[7px] font-orbitron text-gundam-text-muted">{new Date(offer.createdAt).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowOfferModal(false)
                setOfferImageFiles([])
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-gundam-cyan bg-gundam-dark-surface p-5 shadow-[0_0_50px_rgba(0,243,255,0.2)] sm:p-8"
            >
              <h2 className="text-glow mb-6 text-2xl font-orbitron uppercase tracking-widest text-gundam-cyan">{t('trade.detail.offerTitle')}</h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan opacity-80">{t('trade.detail.tacticalObjective')}</label>
                  <textarea
                    className="w-full resize-none rounded-lg border border-gundam-cyan/30 bg-black/50 p-4 font-rajdhani text-lg text-white outline-none transition-all focus:border-gundam-cyan"
                    rows="5"
                    placeholder={t('trade.detail.offerPlaceholder')}
                    value={offerDescription}
                    onChange={(event) => setOfferDescription(event.target.value)}
                    disabled={submittingOffer}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan opacity-80">{t('trade.detail.offerVisuals')}</label>
                  <label className="group flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gundam-cyan/30 transition-all hover:bg-gundam-cyan/5">
                    <span className="text-[10px] font-orbitron uppercase text-gundam-text-secondary opacity-60 transition-opacity group-hover:opacity-100">{t('trade.detail.uploadPhotos')}</span>
                    <span className="mt-1 text-[9px] opacity-40">{t('trade.detail.uploadHint')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => setOfferImageFiles(Array.from(event.target.files || []))}
                    />
                  </label>
                  {offerImageFiles.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {offerImageFiles.map((file) => (
                        <div key={`${file.name}-${file.size}`} className="truncate rounded border border-gundam-cyan/20 bg-black/20 px-3 py-2 text-[10px] text-gundam-text-secondary">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    onClick={handleOfferSubmit}
                    disabled={submittingOffer || !offerDescription.trim()}
                    className="flex-1 bg-gundam-cyan py-4 font-orbitron font-bold uppercase tracking-[0.2em] text-black shadow-cyan-glow transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingOffer ? t('trade.detail.transmitting') : t('trade.detail.dispatch')}
                  </button>
                  <button
                    onClick={() => {
                      setShowOfferModal(false)
                      setOfferImageFiles([])
                    }}
                    disabled={submittingOffer}
                    className="border border-gundam-red px-6 py-4 font-orbitron font-bold uppercase tracking-widest text-gundam-red transition-all hover:bg-gundam-red/10 disabled:opacity-50"
                  >
                    {t('trade.detail.abort')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-gundam-red/50 bg-gundam-dark-surface p-5 shadow-[0_0_40px_rgba(239,68,68,0.18)] sm:p-8"
            >
              <h2 className="mb-6 text-2xl font-orbitron uppercase tracking-widest text-gundam-red">{t('trade.detail.reportTitle')}</h2>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[10px] font-orbitron uppercase tracking-widest text-gundam-red opacity-80">{t('trade.detail.reportReason')}</label>
                  <input
                    value={reportReason}
                    onChange={(event) => setReportReason(event.target.value)}
                    className="w-full rounded-lg border border-gundam-red/30 bg-black/50 p-4 font-rajdhani text-white outline-none transition-all focus:border-gundam-red"
                    placeholder={t('trade.detail.reportPlaceholder')}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-orbitron uppercase tracking-widest text-gundam-red opacity-80">{t('trade.detail.reportDetails')}</label>
                  <textarea
                    rows="5"
                    value={reportDetails}
                    onChange={(event) => setReportDetails(event.target.value)}
                    className="w-full resize-none rounded-lg border border-gundam-red/30 bg-black/50 p-4 font-rajdhani text-white outline-none transition-all focus:border-gundam-red"
                    placeholder={t('trade.detail.reportDetailsPlaceholder')}
                  />
                </div>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                  <button
                    onClick={handleSubmitReport}
                    disabled={submittingReport || !reportReason.trim() || !reportDetails.trim()}
                    className="flex-1 bg-gundam-red py-4 font-orbitron font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-red-500 disabled:opacity-50"
                  >
                    {submittingReport ? t('trade.detail.transmitting') : t('trade.detail.submitReport')}
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    disabled={submittingReport}
                    className="border border-white/10 px-6 py-4 font-orbitron font-bold uppercase tracking-widest text-white transition-all hover:bg-white/5 disabled:opacity-50"
                  >
                    {t('trade.detail.cancel')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TradeDetailPage
