import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import tradeService from '../../services/tradeService';

const CreateTradePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wantedItems: '',
    condition: 'New (MISB)',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const conditions = [
    'New (MISB)',
    'Mint (BIB)',
    'Used / Pre-owned',
    'Damaged / Parts only',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (imageFiles.length === 0) {
        setError('Please attach at least one image for the trade listing.');
        return;
      }

      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      submissionData.append('wantedItems', formData.wantedItems);
      submissionData.append('condition', formData.condition);
      imageFiles.forEach((file) => {
        submissionData.append('images', file);
      });

      await tradeService.createListing(submissionData);
      navigate('/trade');
    } catch (err) {
      setError(err.response?.data?.message || 'Transmission failed. Engine malfunction.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-orbitron text-gundam-cyan glow-text mb-2 uppercase">
          New Trade Mission
        </h1>
        <p className="text-gundam-text-secondary">
          Transmit your proposal to the global Gundam network. 
        </p>
      </motion.div>

      {error && (
        <div className="bg-gundam-red/20 border border-gundam-red text-gundam-red p-4 mb-8 font-orbitron text-sm uppercase tracking-widest text-center">
          [ERROR] {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-gundam-dark-surface/50 border border-gundam-cyan/20 p-8 rounded-lg shadow-2xl backdrop-blur-md">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">Item Designation (Title)</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded font-medium"
              placeholder="e.g. MG Gundam Barbatos Lupus Rex - Custom Painted"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">Condition Protocol</label>
              <select 
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded appearance-none"
              >
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">Target Objective (Wanted Items)</label>
            <input 
              required
              name="wantedItems"
              value={formData.wantedItems}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded"
              placeholder="What are you looking for in exchange?"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">Intel Briefing (Description)</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded resize-none"
              placeholder="Detail the item's condition, included parts, and any flaws..."
            ></textarea>
          </div>

          <div>
             <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">Visual Confirmation (Images)</label>
             <label className="h-32 border-2 border-dashed border-gundam-cyan/30 flex flex-col items-center justify-center text-gundam-text-secondary rounded cursor-pointer hover:bg-gundam-cyan/5 transition-all">
                <span className="text-xs uppercase tracking-widest font-orbitron mb-2">Upload Data Streams</span>
                <span className="text-[10px] opacity-60">(Max 5 images / Cloudinary upload)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
                />
             </label>
             {imageFiles.length > 0 && (
               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {imageFiles.map((file) => (
                   <div key={`${file.name}-${file.size}`} className="rounded border border-gundam-cyan/20 bg-black/30 px-3 py-2 text-[10px] text-gundam-text-secondary truncate">
                     {file.name}
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] disabled:opacity-50"
          >
            {loading ? 'Transmitting...' : 'Dispatch Proposal'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/trade')}
            className="px-8 py-4 border-2 border-gundam-red text-gundam-red font-orbitron font-bold uppercase hover:bg-gundam-red/10 transition-all"
          >
            Abort
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTradePage;
