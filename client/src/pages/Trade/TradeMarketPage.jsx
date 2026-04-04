import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import tradeService from '../../services/tradeService';

const TradeMarketPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await tradeService.getListings();
        setListings(data?.results || []);
      } catch (err) {
        setError('Failed to load trade data stream. Please re-initialize connection.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen bg-gundam-darker">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-orbitron text-gundam-cyan glow-text mb-4">
          TRADE HUB
        </h1>
        <p className="text-gundam-text-secondary max-w-2xl mx-auto">
          Exchange your Gunpla models with other collectors. Tactical negotiation initiated.
        </p>
      </motion.div>

      {error && (
        <div className="bg-gundam-red/20 border border-gundam-red text-gundam-red p-4 mb-8 font-orbitron text-sm uppercase tracking-widest text-center">
          [ERROR] {error}
        </div>
      )}

      {/* Filter / Actions Bar */}
      <div className="flex justify-between items-center mb-8 border-b border-gundam-cyan/30 pb-4">
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gundam-cyan/10 border border-gundam-cyan text-gundam-cyan uppercase text-xs font-bold tracking-widest hover:bg-gundam-cyan hover:text-black transition-all duration-300">
            Filter: All
          </button>
        </div>
        <Link 
          to="/trade/new"
          className="px-6 py-2 bg-gundam-red text-white uppercase text-xs font-bold tracking-widest clip-path-mech hover:bg-gundam-red-hover transition-all duration-300 shadow-[0_0_15px_rgba(255,50,50,0.5)]"
        >
          Post Trade
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-96 bg-gundam-dark-surface animate-pulse border border-gundam-cyan/10 rounded-lg"></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gundam-cyan/10 rounded-xl">
           <p className="text-gundam-text-secondary font-orbitron uppercase tracking-widest mb-4">No active trade signals detected</p>
           <Link 
            to="/trade/new"
            className="text-gundam-cyan hover:glow-text transition-all font-bold underline"
           >
             Be the first to transmit a proposal
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gundam-dark-surface border border-gundam-cyan/20 hover:border-gundam-cyan/60 transition-all duration-500 overflow-hidden rounded-lg shadow-lg"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1589118949245-7d48d24bc04b?q=80&w=600'} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 right-4 bg-black/80 border border-gundam-cyan text-gundam-cyan px-3 py-1 text-[10px] font-orbitron uppercase tracking-tighter">
                  {item.condition}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-orbitron text-white mb-2 group-hover:text-gundam-cyan transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-gundam-text-secondary text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="bg-black/40 p-3 border-l-2 border-gundam-cyan mb-4">
                  <span className="text-[10px] text-gundam-cyan uppercase block mb-1">Looking for:</span>
                  <p className="text-xs text-white truncate">{item.wantedItems || 'Open negotiation'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gundam-text-secondary italic">By {item.owner?.displayName || 'Unknown Pilot'}</span>
                  <Link 
                    to={`/trade/${item._id}`}
                    className="px-4 py-2 border border-gundam-cyan/50 text-gundam-cyan text-xs font-bold uppercase hover:bg-gundam-cyan/20 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* Mecha UI corner elements */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gundam-cyan opacity-40 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gundam-cyan opacity-40 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeMarketPage;
