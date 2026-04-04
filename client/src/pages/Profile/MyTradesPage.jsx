import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Repeat, CheckCircle, ChevronRight, MessageSquare, AlertTriangle } from 'lucide-react';
import tradeService from '../../services/tradeService';
import useAuthStore from '../../stores/authStore';

const MyTradesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [myListings, setMyListings] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); // or 'offers'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const listings = await tradeService.queryListings({ owner: user._id });
        setMyListings(listings?.results || []);
        const offers = await tradeService.getMyOffers();
        setMyOffers(offers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="pt-32 text-center text-gundam-cyan font-orbitron animate-pulse">Scanning Personnel Fleet...</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-orbitron text-white uppercase tracking-tighter glow-text italic">
            Command Dashboard
          </h1>
          <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.4em] mt-2 flex items-center gap-2 italic">
            <span className="w-1.5 h-1.5 bg-gundam-cyan rounded-full animate-ping" /> Mission Logs & Fleet Management
          </p>
        </div>
        <Link 
          to="/trade/new" 
          className="px-8 py-3 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-widest hover:bg-white transition-all shadow-cyan-glow"
        >
          New Mission
        </Link>
      </div>

      {/* Stats Summary HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <StatCard label="Active Listings" value={myListings.length} icon={<Repeat className="text-gundam-cyan" />} />
         <StatCard label="Sent Proposals" value={myOffers.length} icon={<MessageSquare className="text-gundam-amber" />} />
         <StatCard label="Successful Trades" value={myListings.filter((item) => item.status === 'completed').length} icon={<CheckCircle className="text-gundam-emerald" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gundam-cyan/20 mb-8">
         <button 
           onClick={() => setActiveTab('listings')}
           className={`pb-4 px-2 font-orbitron text-xs uppercase tracking-widest transition-all relative ${activeTab === 'listings' ? 'text-gundam-cyan font-bold' : 'text-gundam-text-muted hover:text-white'}`}
         >
           My Trade Listings
           {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gundam-cyan shadow-[0_0_10px_#00f3ff]" />}
         </button>
         <button 
           onClick={() => setActiveTab('offers')}
           className={`pb-4 px-2 font-orbitron text-xs uppercase tracking-widest transition-all relative ${activeTab === 'offers' ? 'text-gundam-cyan font-bold' : 'text-gundam-text-muted hover:text-white'}`}
         >
           My Sent Proposals
           {activeTab === 'offers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gundam-cyan shadow-[0_0_10px_#00f3ff]" />}
         </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {activeTab === 'listings' ? (
          myListings.length === 0 ? (
            <EmptyState message="No active trade missions detected in your sector." linkText="Launch New Mission" linkTo="/trade/new" />
          ) : (
            myListings.map(listing => (
              <TradeItemCard key={listing._id} item={listing} type="listing" />
            ))
          )
        ) : (
          myOffers.length === 0 ? (
            <EmptyState message="You haven't dispatched any trade proposals yet." linkText="Enter Trade Hub" linkTo="/trade" />
          ) : (
            myOffers.map((offer) => (
              <TradeItemCard key={offer._id} item={offer.listing} subtitle={`Status: ${offer.status}`} />
            ))
          )
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-gundam-dark-surface/50 border border-gundam-cyan/20 p-6 rounded-lg backdrop-blur-md flex items-center justify-between">
    <div>
      <span className="text-[10px] font-orbitron text-gundam-text-muted uppercase tracking-widest block mb-1">{label}</span>
      <span className="text-3xl font-orbitron text-white">{value}</span>
    </div>
    <div className="w-12 h-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-2xl uppercase">
       {icon}
    </div>
  </div>
);

const TradeItemCard = ({ item, subtitle }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      className="bg-gundam-dark-surface/40 border border-gundam-cyan/10 hover:border-gundam-cyan/40 p-4 rounded-lg flex items-center gap-6 group transition-all"
    >
      <div className="w-20 h-20 bg-black rounded border border-gundam-cyan/20 overflow-hidden flex-shrink-0 p-1">
        <img src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1589118949245-7d48d24bc04b?q=80&w=600'} alt={item.title} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
           <span className={`text-[9px] font-orbitron px-2 py-0.5 rounded border border-current tracking-tighter uppercase ${item.status === 'open' ? 'text-gundam-cyan bg-gundam-cyan/5' : 'text-gundam-emerald bg-gundam-emerald/5'}`}>
             {item.status}
           </span>
           <span className="text-[10px] font-orbitron text-gundam-text-muted italic opacity-50 uppercase tracking-tighter">
             REF: {item._id.slice(-8)}
           </span>
        </div>
        <h4 className="text-lg font-orbitron text-white uppercase tracking-tight line-clamp-1">{item.title}</h4>
        <p className="text-xs text-gundam-text-muted font-rajdhani line-clamp-1 italic px-0.5">{subtitle || `Searching for: ${item.wantedItems}`}</p>
      </div>

      <div className="flex flex-col items-end gap-2 pr-4">
         <span className="text-[10px] font-orbitron text-gundam-text-muted uppercase tracking-widest opacity-60">Created At</span>
         <span className="text-xs font-orbitron text-white tracking-widest opacity-80">{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>

      <button 
        onClick={() => navigate(`/trade/${item._id}`)}
        className="h-12 w-12 flex items-center justify-center bg-gundam-cyan/10 hover:bg-gundam-cyan text-gundam-cyan hover:text-black transition-all rounded"
      >
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
};

const EmptyState = ({ message, linkText, linkTo }) => (
  <div className="py-20 text-center glass-card border-dashed border-gundam-cyan/20 space-y-4">
    <AlertTriangle className="mx-auto text-gundam-text-muted opacity-30" size={48} />
    <p className="font-orbitron text-sm text-gundam-text-muted uppercase tracking-widest opacity-70 italic">{message}</p>
    {linkText && (
       <Link to={linkTo} className="inline-block mt-4 text-gundam-cyan font-orbitron text-xs tracking-widest uppercase underline underline-offset-8 hover:text-white transition-all">
          {linkText}
       </Link>
    )}
  </div>
);

export default MyTradesPage;
