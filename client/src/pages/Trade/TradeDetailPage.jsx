import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import tradeService from '../../services/tradeService';
import useAuthStore from '../../stores/authStore';

const TradeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [listing, setListing] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Offer Form State
  const [offerDescription, setOfferDescription] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [processingOfferId, setProcessingOfferId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const isOwner = user && listing && user._id === listing.owner._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const listingData = await tradeService.getListing(id);
        setListing(listingData);

        // If user is owner, fetch offers
        if (user && user._id === listingData.owner._id) {
          const offersData = await tradeService.getOffers(id);
          setOffers(offersData);
        }
      } catch (err) {
        setError('Failed to retrieve tactical data from the sector.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleOfferSubmit = async () => {
    if (!offerDescription.trim()) return;
    try {
      setSubmittingOffer(true);
      const offerData = {
        offeredItemsDescription: offerDescription,
        images: [{ url: 'https://images.unsplash.com/photo-1589118949245-7d48d24bc04b?q=80&w=250', publicId: 'offer_placeholder' }]
      };
      const createdOffer = await tradeService.createOffer(id, offerData);
      setShowOfferModal(false);
      navigate(createdOffer?.conversationId ? `/chat?conversation=${createdOffer.conversationId}` : '/chat');
    } catch (err) {
      alert('Offer transmission failed. Check connection.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleUpdateOfferStatus = async (offerId, status) => {
    try {
      setProcessingOfferId(offerId);
      await tradeService.updateOfferStatus(id, offerId, status);
      
      // Refresh listing and offers
      const listingData = await tradeService.getListing(id);
      const offersData = await tradeService.getOffers(id);
      setListing(listingData);
      setOffers(offersData);

      if (status === 'accepted') {
        alert('Mission Success: Trade agreement finalized.');
      }
    } catch (err) {
      alert('Strategic error during status update.');
    } finally {
      setProcessingOfferId(null);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim() || !reportDetails.trim()) return;

    try {
      setSubmittingReport(true);
      await tradeService.reportListing(id, {
        reason: reportReason,
        details: reportDetails,
      });
      setShowReportModal(false);
      setReportReason('');
      setReportDetails('');
      alert('Violation report transmitted to command moderation.');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to submit violation report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-gundam-cyan font-orbitron animate-pulse">Initializing Data Stream...</div>;

  if (error || !listing) return (
    <div className="pt-32 text-center">
      <div className="text-gundam-red font-orbitron uppercase mb-4">[CRITICAL ERROR]</div>
      <p className="text-gundam-text-secondary">{error || 'Data packet lost.'}</p>
      <button onClick={() => navigate('/trade')} className="mt-8 text-gundam-cyan underline uppercase text-xs font-orbitron text-glow">Return to Market</button>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-square border border-gundam-cyan/30 rounded-lg overflow-hidden bg-black shadow-2xl group">
            <img src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1589118949245-7d48d24bc04b?q=80&w=900'} alt={listing.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className={`${listing.status === 'open' ? 'bg-gundam-red shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gundam-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)]'} px-4 py-1 text-[10px] font-orbitron text-white skew-x-[-12deg] tracking-widest`}>
                {listing.status === 'open' ? 'MISSION OPEN' : 'MISSION COMPLETE'}
              </span>
            </div>
            {/* Tech Scan Effect overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(listing.images || []).map((img, idx) => (
              <div key={idx} className="aspect-square border border-gundam-cyan/20 rounded cursor-pointer hover:border-gundam-cyan transition-all overflow-hidden bg-gundam-dark-surface p-1">
                <img src={img.url} alt={`${listing.title}-${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-8"
        >
          <div className="relative">
            <div className="flex items-center gap-4 mb-2 text-gundam-cyan text-[10px] font-orbitron tracking-widest">
              <span className="bg-white/5 px-2 py-0.5 rounded">SCAN_ID: {listing._id.substring(listing._id.length - 8)}</span>
              <span>|</span>
              <span className="opacity-60 uppercase">{new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-orbitron text-white glow-text uppercase tracking-tighter leading-none mb-4">
              {listing.title}
            </h1>
            <div className="flex gap-4">
               <span className="bg-gundam-cyan/5 border border-gundam-cyan/40 text-gundam-cyan px-4 py-1 text-[10px] font-bold uppercase tracking-widest font-orbitron">
                  Cond: {listing.condition}
               </span>
            </div>
          </div>

          <div className="bg-gundam-dark-surface/80 border border-gundam-cyan/20 p-6 rounded-lg relative overflow-hidden backdrop-blur-md shadow-xl">
             <h3 className="text-gundam-cyan font-orbitron text-[10px] uppercase mb-4 flex items-center gap-2 tracking-[0.2em]">
                <span className="w-1.5 h-1.5 bg-gundam-cyan rounded-full animate-pulse shadow-[0_0_8px_#00f3ff]"></span>
                Tactical Objective: Wanted
             </h3>
             <p className="text-2xl text-white font-rajdhani font-bold italic tracking-wide">{listing.wantedItems}</p>
             {/* Tech grid overlay */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#00f3ff1a_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"></div>
          </div>

          <div className="space-y-4 text-gundam-text-secondary leading-relaxed border-t border-gundam-cyan/10 pt-6">
             <h4 className="text-white font-orbitron text-[10px] uppercase tracking-[0.3em] opacity-80 mb-3">Signal Decryption (Description)</h4>
             <p className="font-rajdhani text-lg">{listing.description}</p>
          </div>

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
             {isOwner ? (
                <div className="w-full p-4 border border-gundam-cyan/30 bg-gundam-cyan/5 rounded font-orbitron text-xs text-gundam-cyan text-center uppercase tracking-widest italic animate-pulse">
                  System Awaiting Incoming Proposals...
                </div>
             ) : (
               <>
                 <button 
                  disabled={listing.status !== 'open'}
                  onClick={() => setShowOfferModal(true)}
                  className="flex-1 py-4 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_25px_rgba(0,243,255,0.4)] disabled:opacity-30 disabled:grayscale"
                 >
                   {listing.status === 'open' ? 'Initiate Proposal' : 'Sector Closed'}
                 </button>
                 <button className="px-8 py-4 bg-transparent border-2 border-gundam-cyan/40 text-gundam-cyan font-orbitron font-bold uppercase tracking-widest hover:bg-gundam-cyan/10 transition-all">
                   Save Map
                 </button>
                 <button
                  onClick={() => setShowReportModal(true)}
                  className="px-8 py-4 bg-transparent border-2 border-gundam-red/40 text-gundam-red font-orbitron font-bold uppercase tracking-widest hover:bg-gundam-red/10 transition-all"
                 >
                   Report Listing
                 </button>
               </>
             )}
          </div>

          {/* Owner Identity */}
          <div className="pt-8 mt-8 border-t border-gundam-cyan/10 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-gundam-dark-surface border border-gundam-cyan/30 flex items-center justify-center font-orbitron text-gundam-cyan text-xl shadow-inner shadow-black">
                  {listing.owner?.displayName?.[0] || '?'}
                </div>
                <div>
                   <p className="text-white font-orbitron uppercase text-xs tracking-widest">{listing.owner?.displayName || 'Unknown Pilot'}</p>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-gundam-text-muted text-[9px] uppercase tracking-tighter">Pilot Compatibility:</span>
                     <span className="text-gundam-cyan text-xs font-bold font-orbitron">{listing.owner.reputation?.score || 0}%</span>
                   </div>
                </div>
             </div>
             {listing.owner.address?.city && (
               <div className="text-right">
                  <span className="block text-[9px] text-gundam-text-muted font-orbitron uppercase">Sector Lock</span>
                  <span className="text-white text-[10px] font-orbitron">{listing.owner.address.city}</span>
               </div>
             )}
          </div>
        </motion.div>
      </div>

      {/* OFFERS MANAGEMENT SECTION (FOR OWNER) */}
      {isOwner && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-24 border-t border-gundam-cyan/20 pt-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-orbitron text-white uppercase tracking-widest">Received Signal Stream</h2>
              <p className="text-gundam-cyan text-[10px] font-orbitron uppercase mt-1 tracking-[0.2em] opacity-70">Monitor incoming trade proposals from other pilots</p>
            </div>
            <span className="bg-gundam-dark-surface border border-gundam-cyan/30 px-3 py-1 rounded font-orbitron text-[10px] text-gundam-cyan uppercase">
              {offers.length} ACTIVE SIGNALS
            </span>
          </div>

          {offers.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-gundam-cyan/10 rounded-xl bg-white/5">
              <p className="text-gundam-text-secondary font-orbitron text-xs uppercase tracking-widest opacity-50">No incoming signals detected in this sector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <motion.div 
                  key={offer._id}
                  whileHover={{ y: -5 }}
                  className={`p-6 border ${offer.status === 'accepted' ? 'border-gundam-emerald bg-gundam-emerald/5' : 'border-gundam-cyan/20 bg-gundam-dark-surface/50'} rounded-lg relative transition-all group`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded bg-black flex items-center justify-center font-orbitron text-gundam-cyan text-[10px] border border-gundam-cyan/20">
                          {offer.offerer?.displayName?.[0] || '?'}
                       </div>
                       <span className="text-white font-orbitron text-[11px] uppercase tracking-wider">{offer.offerer?.displayName || 'Unknown Pilot'}</span>
                    </div>
                    <span className={`text-[9px] font-orbitron px-2 py-0.5 rounded uppercase tracking-tighter ${
                      offer.status === 'accepted' ? 'text-gundam-emerald border border-gundam-emerald' : 
                      offer.status === 'rejected' ? 'text-gundam-red border border-gundam-red' : 
                      'text-gundam-cyan border border-gundam-cyan opacity-80'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                  
                  <p className="text-gundam-text-secondary font-rajdhani text-sm italic mb-6 line-clamp-3 leading-relaxed">
                    "{offer.offeredItemsDescription}"
                  </p>

                  <div className="flex gap-2">
                    {offer.status === 'pending' && (
                      <>
                        <button 
                          disabled={processingOfferId === offer._id}
                          onClick={() => handleUpdateOfferStatus(offer._id, 'accepted')}
                          className="flex-1 py-2 bg-gundam-cyan text-black font-orbitron text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button 
                          disabled={processingOfferId === offer._id}
                          onClick={() => handleUpdateOfferStatus(offer._id, 'rejected')}
                          className="flex-1 py-2 border border-gundam-red/50 text-gundam-red font-orbitron text-[10px] font-bold uppercase tracking-widest hover:bg-gundam-red/10 transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => navigate(offer.conversationId ? `/chat?conversation=${offer.conversationId}` : '/chat')}
                      className="w-12 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Date badge */}
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[7px] text-gundam-text-muted font-orbitron translate-y-1 block">{new Date(offer.createdAt).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfferModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
             />
             <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-gundam-dark-surface border border-gundam-cyan p-8 rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.2)]"
             >
                <h2 className="text-2xl font-orbitron text-gundam-cyan mb-6 uppercase tracking-widest text-glow">Mission Proposal</h2>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-widest opacity-80">Proposal Logistics</label>
                      <textarea 
                        className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded-lg font-rajdhani text-lg resize-none"
                        rows="5"
                        placeholder="Detail your exchange items and tactical advantages..."
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        disabled={submittingOffer}
                      ></textarea>
                   </div>
                   <div>
                      <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-widest opacity-80">Visual Evidence Payload</label>
                      <div className="h-28 border-2 border-dashed border-gundam-cyan/30 flex flex-col items-center justify-center text-gundam-text-secondary rounded-lg cursor-pointer hover:bg-gundam-cyan/5 transition-all group">
                         <span className="text-[10px] font-orbitron uppercase opacity-60 group-hover:opacity-100 transition-opacity">Upload tactical photos</span>
                         <span className="text-[9px] opacity-40 mt-1">(Demo Placeholder Enabled)</span>
                      </div>
                   </div>
                   <div className="flex gap-4 pt-4">
                      <button 
                        onClick={handleOfferSubmit}
                        disabled={submittingOffer || !offerDescription.trim()}
                        className="flex-1 py-4 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyan-glow"
                      >
                        {submittingOffer ? 'TRANSMITTING...' : 'DISPATCH OFFER'}
                      </button>
                      <button 
                        onClick={() => setShowOfferModal(false)}
                        disabled={submittingOffer}
                        className="px-6 py-4 border border-gundam-red text-gundam-red font-orbitron font-bold uppercase tracking-widest hover:bg-gundam-red/10 transition-all disabled:opacity-50"
                      >
                        ABORT
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
              className="relative w-full max-w-xl bg-gundam-dark-surface border border-gundam-red/50 p-8 rounded-lg shadow-[0_0_40px_rgba(239,68,68,0.18)]"
            >
              <h2 className="text-2xl font-orbitron text-gundam-red mb-6 uppercase tracking-widest">Violation Report</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] text-gundam-red font-orbitron uppercase mb-2 tracking-widest opacity-80">Reason</label>
                  <input
                    value={reportReason}
                    onChange={(event) => setReportReason(event.target.value)}
                    className="w-full bg-black/50 border border-gundam-red/30 p-4 text-white focus:border-gundam-red outline-none transition-all rounded-lg font-rajdhani"
                    placeholder="Counterfeit listing, abusive content, scam signal..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gundam-red font-orbitron uppercase mb-2 tracking-widest opacity-80">Details</label>
                  <textarea
                    rows="5"
                    value={reportDetails}
                    onChange={(event) => setReportDetails(event.target.value)}
                    className="w-full bg-black/50 border border-gundam-red/30 p-4 text-white focus:border-gundam-red outline-none transition-all rounded-lg font-rajdhani resize-none"
                    placeholder="Describe the violation so moderation can investigate quickly."
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleSubmitReport}
                    disabled={submittingReport || !reportReason.trim() || !reportDetails.trim()}
                    className="flex-1 py-4 bg-gundam-red text-white font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-red-500 transition-all disabled:opacity-50"
                  >
                    {submittingReport ? 'TRANSMITTING...' : 'SUBMIT REPORT'}
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    disabled={submittingReport}
                    className="px-6 py-4 border border-white/10 text-white font-orbitron font-bold uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradeDetailPage;
