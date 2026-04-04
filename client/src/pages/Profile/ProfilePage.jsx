import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, X, Shield, Activity, Target } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import userService from '../../services/userService';

const ProfilePage = () => {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: '',
    },
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || { street: '', ward: '', district: '', city: '' },
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(formData);
      setAuth(updatedUser, useAuthStore.getState().accessToken, useAuthStore.getState().refreshToken);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Strategic error during profile reconfiguration.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const updatedUser = await userService.updateAvatar(file);
      setAuth(updatedUser, useAuthStore.getState().accessToken, useAuthStore.getState().refreshToken);
    } catch (err) {
      console.error(err);
      alert('Avatar transmission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="pt-32 text-center text-gundam-cyan font-orbitron animate-pulse">Initializing Pilot Data...</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pilot HUD Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-gundam-dark-surface/50 border border-gundam-cyan/30 p-8 rounded-lg relative overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Top scanning line decoration */}
            <div className="absolute top-0 left-0 w-full hud-line opacity-30" />
            
            <div className="flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded bg-black border-2 border-gundam-cyan/50 p-1 relative overflow-hidden">
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt="Pilot Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gundam-cyan/30 bg-white/5">
                      <User size={64} />
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gundam-cyan border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-gundam-cyan text-black rounded flex items-center justify-center hover:bg-white transition-all shadow-lg"
                >
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpdate} accept="image/*" />
              </div>

              <h2 className="text-2xl font-orbitron text-white glow-text uppercase tracking-tighter mb-1">
                {user.displayName}
              </h2>
              <div className="flex items-center gap-2 text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest opacity-70 mb-4 font-bold">
                <Shield size={12} /> Rank: Elite Pilot
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mt-4 border-t border-gundam-cyan/10 pt-6">
                 <div className="text-center">
                    <span className="block text-[9px] text-gundam-text-muted font-orbitron uppercase mb-1">Compatibility</span>
                    <span className="text-xl font-orbitron text-white">{user.reputation?.score || 0}%</span>
                 </div>
                 <div className="text-center">
                    <span className="block text-[9px] text-gundam-text-muted font-orbitron uppercase mb-1">Missions</span>
                    <span className="text-xl font-orbitron text-white">12</span>
                 </div>
              </div>
            </div>
            
            {/* HUD Decorations */}
            <div className="mt-8 space-y-4 border-t border-gundam-cyan/10 pt-6">
               <div className="flex justify-between items-center text-[10px] uppercase font-orbitron">
                  <span className="text-gundam-text-muted">System Status</span>
                  <span className="text-gundam-emerald animate-pulse font-bold tracking-widest">Active</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-gundam-cyan"
                  />
               </div>
               <div className="flex justify-between items-center text-[10px] uppercase font-orbitron">
                  <span className="text-gundam-text-muted">Member Since</span>
                  <span className="text-white opacity-60 tracking-widest">{new Date(user.createdAt).getFullYear()}</span>
               </div>
            </div>
          </div>

          <div className="bg-gundam-bg-secondary/50 border border-gundam-cyan/10 p-6 rounded-lg font-orbitron text-[10px] uppercase tracking-[0.2em] space-y-4">
             <div className="flex items-center gap-2 text-gundam-cyan font-bold">
                <Activity size={14} /> Real-time Telemetry
             </div>
             <p className="text-gundam-text-muted leading-relaxed italic opacity-50">
               Strategic monitoring confirms pilot's authorization level is sufficient for high-tier planetary trades.
             </p>
          </div>
        </motion.div>

        {/* Right Column: Fleet Data & Logistics */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Tabs for Navigation */}
          <div className="flex gap-8 border-b border-gundam-cyan/20 pb-1">
             {['Mission Logs', 'Logistics', 'Settings'].map(tab => (
               <button 
                key={tab}
                className={`pb-4 px-2 font-orbitron text-[11px] uppercase tracking-widest transition-all relative ${tab === 'Logistics' ? 'text-gundam-cyan font-bold' : 'text-gundam-text-muted hover:text-white'}`}
               >
                 {tab}
                 {tab === 'Logistics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gundam-cyan glow-box" />}
               </button>
             ))}
          </div>

          <div className="bg-gundam-dark-surface/30 border border-gundam-cyan/10 p-8 rounded-lg shadow-xl relative backdrop-blur-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-orbitron text-white uppercase tracking-wider flex items-center gap-3">
                   <Target size={20} className="text-gundam-cyan" /> Pilot Logistics Data
                </h3>
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 border border-gundam-cyan text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest hover:bg-gundam-cyan/10 transition-all rounded shadow-cyan-glow/20"
                  >
                    Reconfigure
                  </button>
                ) : null}
             </div>

             <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <User size={12} /> Call Sign
                      </label>
                      <input 
                        type="text"
                        disabled={!editing || loading}
                        className="w-full bg-black/40 border border-gundam-cyan/20 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded disabled:opacity-50"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Mail size={12} /> Direct Channel
                      </label>
                      <input 
                        type="email"
                        disabled
                        className="w-full bg-black/40 border border-white/5 p-4 text-white/40 outline-none rounded font-rajdhani"
                        value={user.email}
                      />
                      <span className="text-[8px] text-gundam-text-muted italic block mt-1 uppercase tracking-tighter">* Non-reconfigurable mission channel</span>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Phone size={12} /> Comms ID
                      </label>
                      <input 
                        type="text"
                        disabled={!editing || loading}
                        className="w-full bg-black/40 border border-gundam-cyan/20 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded font-rajdhani"
                        value={formData.phone}
                        placeholder="Pilot Phone Signal"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <MapPin size={12} /> Sector HQ (Location)
                      </label>
                      <input 
                        type="text"
                        disabled={!editing || loading}
                        className="w-full bg-black/40 border border-gundam-cyan/20 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded font-rajdhani"
                        placeholder="City / Space Colony"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, city: e.target.value}
                        })}
                      />
                   </div>
                </div>

                <div className="space-y-2 pt-4">
                    <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest opacity-60 flex items-center gap-2">
                      <MapPin size={12} /> Detailed Coordinates (Street Address)
                    </label>
                    <textarea 
                      disabled={!editing || loading}
                      rows="3"
                      className="w-full bg-black/40 border border-gundam-cyan/20 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded resize-none italic font-rajdhani"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, street: e.target.value}
                      })}
                    ></textarea>
                </div>

                {editing && (
                  <div className="flex gap-4 pt-6">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Transmitting...' : (
                        <>
                          Save Configuration <Save size={18} />
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={loading}
                      className="px-8 py-4 border border-gundam-red text-gundam-red font-orbitron font-bold uppercase tracking-widest hover:bg-gundam-red/10 transition-all flex items-center justify-center gap-2"
                    >
                      Discard <X size={18} />
                    </button>
                  </div>
                )}
             </form>
          </div>

          {/* Activity Mini Stats HUD */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-gundam-dark-surface/20 border border-gundam-cyan/5 p-4 rounded text-center group hover:border-gundam-cyan/30 transition-all">
                <span className="text-[9px] text-gundam-text-muted font-orbitron uppercase block mb-2 opacity-50">Pilot XP</span>
                <span className="text-xl font-orbitron text-white tracking-widest">2,480</span>
             </div>
             <div className="bg-gundam-dark-surface/20 border border-gundam-cyan/5 p-4 rounded text-center group hover:border-gundam-emerald/30 transition-all">
                <span className="text-[9px] text-gundam-text-muted font-orbitron uppercase block mb-2 opacity-50">Signal Success</span>
                <span className="text-xl font-orbitron text-gundam-emerald tracking-widest">100%</span>
             </div>
             <div className="bg-gundam-dark-surface/20 border border-gundam-cyan/5 p-4 rounded text-center group hover:border-gundam-red/30 transition-all">
                <span className="text-[9px] text-gundam-text-muted font-orbitron uppercase block mb-2 opacity-50">Fleet Capacity</span>
                <span className="text-xl font-orbitron text-white tracking-widest">50</span>
             </div>
             <div className="bg-gundam-dark-surface/20 border border-gundam-cyan/5 p-4 rounded text-center group hover:border-gundam-amber/30 transition-all">
                <span className="text-[9px] text-gundam-text-muted font-orbitron uppercase block mb-2 opacity-50">Archive Logs</span>
                <span className="text-xl font-orbitron text-white tracking-widest">5</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
