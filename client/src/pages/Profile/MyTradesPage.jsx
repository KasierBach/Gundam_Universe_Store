import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Repeat, CheckCircle, ChevronRight, MessageSquare, AlertTriangle } from 'lucide-react';
import tradeService from '../../services/tradeService';
import useAuthStore from '../../stores/authStore';
import ModelKitImage from '../../components/shared/ModelKitImage';
import { useI18n } from '../../i18n/I18nProvider';
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy';

const MyTradesPage = () => {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [myListings, setMyListings] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); // or 'offers'
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      loading: 'Đang quét dữ liệu giao dịch...',
      title: 'BẢNG ĐIỀU KHIỂN GIAO DỊCH',
      subtitle: 'Nhật ký nhiệm vụ và quản lý trao đổi',
      newMission: 'Tạo giao dịch mới',
      stats: ['Tin đang mở', 'Đề nghị đã gửi', 'Giao dịch thành công'],
      tabs: ['Tin của tôi', 'Đề nghị đã gửi'],
      emptyListings: 'Chưa có tin trao đổi nào trong khu vực của bạn.',
      launchMission: 'Đăng tin mới',
      emptyOffers: 'Bạn chưa gửi đề nghị trao đổi nào.',
      enterHub: 'Vào sàn trao đổi',
      searchingFor: 'Đang tìm',
      createdAt: 'Ngày tạo',
      unknownPilot: 'Phi công chưa xác định',
      status: 'Trạng thái',
    }
    : {
      loading: 'Scanning Personnel Fleet...',
      title: 'Command Dashboard',
      subtitle: 'Mission Logs & Fleet Management',
      newMission: 'New Mission',
      stats: ['Active Listings', 'Sent Proposals', 'Successful Trades'],
      tabs: ['My Trade Listings', 'My Sent Proposals'],
      emptyListings: 'No active trade missions detected in your sector.',
      launchMission: 'Launch New Mission',
      emptyOffers: "You haven't dispatched any trade proposals yet.",
      enterHub: 'Enter Trade Hub',
      searchingFor: 'Searching for',
      createdAt: 'Created At',
      unknownPilot: 'Unknown Pilot',
      status: 'Status',
    })

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

  if (loading) return <div className="pt-32 text-center text-gundam-cyan font-orbitron animate-pulse">{copy.loading}</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-orbitron text-white uppercase tracking-tighter glow-text italic">
            {copy.title}
          </h1>
          <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.4em] mt-2 flex items-center gap-2 italic">
            <span className="w-1.5 h-1.5 bg-gundam-cyan rounded-full animate-ping" /> {copy.subtitle}
          </p>
        </div>
        <Link 
          to="/trade/new" 
          className="px-8 py-3 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-widest hover:bg-white transition-all shadow-cyan-glow"
        >
          {copy.newMission}
        </Link>
      </div>

      {/* Stats Summary HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <StatCard label={copy.stats[0]} value={myListings.length} icon={<Repeat className="text-gundam-cyan" />} />
         <StatCard label={copy.stats[1]} value={myOffers.length} icon={<MessageSquare className="text-gundam-amber" />} />
         <StatCard label={copy.stats[2]} value={myListings.filter((item) => item.status === 'completed').length} icon={<CheckCircle className="text-gundam-emerald" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gundam-cyan/20 mb-8">
         <button 
           onClick={() => setActiveTab('listings')}
           className={`pb-4 px-2 font-orbitron text-xs uppercase tracking-widest transition-all relative ${activeTab === 'listings' ? 'text-gundam-cyan font-bold' : 'text-gundam-text-muted hover:text-white'}`}
         >
           {copy.tabs[0]}
           {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gundam-cyan shadow-[0_0_10px_#00f3ff]" />}
         </button>
         <button 
           onClick={() => setActiveTab('offers')}
           className={`pb-4 px-2 font-orbitron text-xs uppercase tracking-widest transition-all relative ${activeTab === 'offers' ? 'text-gundam-cyan font-bold' : 'text-gundam-text-muted hover:text-white'}`}
         >
           {copy.tabs[1]}
           {activeTab === 'offers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gundam-cyan shadow-[0_0_10px_#00f3ff]" />}
         </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {activeTab === 'listings' ? (
          myListings.length === 0 ? (
            <EmptyState message={copy.emptyListings} linkText={copy.launchMission} linkTo="/trade/new" />
          ) : (
            myListings.map(listing => (
              <TradeItemCard key={listing._id} item={listing} type="listing" />
            ))
          )
        ) : (
          myOffers.length === 0 ? (
            <EmptyState message={copy.emptyOffers} linkText={copy.enterHub} linkTo="/trade" />
          ) : (
            myOffers.map((offer) => (
              <TradeItemCard key={offer._id} item={offer.listing} subtitle={`${copy.status}: ${offer.status}`} locale={locale} />
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

const TradeItemCard = ({ item, subtitle, locale = 'en' }) => {
  const navigate = useNavigate();
  const copy = locale === 'vi'
    ? { searchingFor: 'Đang tìm', createdAt: 'Ngày tạo' }
    : { searchingFor: 'Searching for', createdAt: 'Created At' }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      className="bg-gundam-dark-surface/40 border border-gundam-cyan/10 hover:border-gundam-cyan/40 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group transition-all"
    >
      <div className="w-20 h-20 bg-black rounded border border-gundam-cyan/20 overflow-hidden flex-shrink-0 p-1">
        <ModelKitImage
          src={item.images?.[0]?.url}
          alt={item.title}
          name={item.title}
          series={item.wantedItems}
          imageClassName="grayscale group-hover:grayscale-0 transition-all duration-500"
        />
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
        <p className="text-xs text-gundam-text-muted font-rajdhani line-clamp-1 italic px-0.5">{subtitle || `${copy.searchingFor}: ${item.wantedItems}`}</p>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-2 sm:pr-4">
         <span className="text-[10px] font-orbitron text-gundam-text-muted uppercase tracking-widest opacity-60">{copy.createdAt}</span>
         <span className="text-xs font-orbitron text-white tracking-widest opacity-80">{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>

      <button 
        onClick={() => navigate(`/trade/${item._id}`)}
        className="h-12 w-full sm:w-12 flex items-center justify-center bg-gundam-cyan/10 hover:bg-gundam-cyan text-gundam-cyan hover:text-black transition-all rounded"
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
