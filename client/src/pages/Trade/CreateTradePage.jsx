import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import tradeService from '../../services/tradeService';
import useUiStore from '../../stores/uiStore';
import { useI18n } from '../../i18n/I18nProvider';
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy';

const CreateTradePage = () => {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const { tradeDraft, setTradeDraft, clearTradeDraft } = useUiStore();
  const [formData, setFormData] = useState({
    title: tradeDraft.title,
    description: tradeDraft.description,
    wantedItems: tradeDraft.wantedItems,
    condition: tradeDraft.condition,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      title: 'Tạo giao dịch mới',
      subtitle: 'Phát tín hiệu trao đổi tới cộng đồng Gundam.',
      imageRequired: 'Vui lòng đính kèm ít nhất một ảnh cho tin trao đổi.',
      failed: 'Không thể gửi tin trao đổi.',
      fields: {
        title: 'Tiêu đề',
        condition: 'Tình trạng',
        wanted: 'Mong muốn nhận lại',
        description: 'Mô tả chi tiết',
        images: 'Hình ảnh minh chứng',
      },
      placeholders: {
        title: 'Ví dụ: MG Gundam Barbatos Lupus Rex - Sơn custom',
        wanted: 'Bạn muốn nhận lại món gì?',
        description: 'Mô tả tình trạng, phụ kiện đi kèm và các lỗi nếu có...',
        upload: 'Tải dữ liệu hình ảnh',
        uploadHint: '(Tối đa 5 ảnh / upload Cloudinary)',
      },
      submitLoading: 'ĐANG GỬI...',
      submit: 'GỬI TIN TRAO ĐỔI',
      abort: 'Hủy',
    }
    : {
      title: 'New Trade Mission',
      subtitle: 'Transmit your proposal to the global Gundam network.',
      imageRequired: 'Please attach at least one image for the trade listing.',
      failed: 'Transmission failed. Engine malfunction.',
      fields: {
        title: 'Item Designation (Title)',
        condition: 'Condition Protocol',
        wanted: 'Target Objective (Wanted Items)',
        description: 'Intel Briefing (Description)',
        images: 'Visual Confirmation (Images)',
      },
      placeholders: {
        title: 'e.g. MG Gundam Barbatos Lupus Rex - Custom Painted',
        wanted: 'What are you looking for in exchange?',
        description: "Detail the item's condition, included parts, and any flaws...",
        upload: 'Upload Data Streams',
        uploadHint: '(Max 5 images / Cloudinary upload)',
      },
      submitLoading: 'Transmitting...',
      submit: 'Dispatch Proposal',
      abort: 'Abort',
    });

  const conditions = locale === 'vi'
    ? [
      { value: 'New (MISB)', label: 'Mới nguyên seal (MISB)' },
      { value: 'Mint (BIB)', label: 'Như mới, đủ hộp (BIB)' },
      { value: 'Used / Pre-owned', label: 'Đã qua sử dụng' },
      { value: 'Damaged / Parts only', label: 'Hỏng / chỉ còn linh kiện' },
    ]
    : [
      { value: 'New (MISB)', label: 'New (MISB)' },
      { value: 'Mint (BIB)', label: 'Mint (BIB)' },
      { value: 'Used / Pre-owned', label: 'Used / Pre-owned' },
      { value: 'Damaged / Parts only', label: 'Damaged / Parts only' },
    ];

  const handleChange = (e) => {
    const nextState = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(nextState);
    setTradeDraft(nextState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (imageFiles.length === 0) {
        setError(copy.imageRequired);
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
      clearTradeDraft();
      navigate('/trade');
    } catch (err) {
      setError(err.response?.data?.message || copy.failed);
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
          {copy.title}
        </h1>
        <p className="text-gundam-text-secondary">
          {copy.subtitle}
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
            <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">{copy.fields.title}</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded font-medium"
              placeholder={copy.placeholders.title}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">{copy.fields.condition}</label>
              <select 
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded appearance-none"
              >
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">{copy.fields.wanted}</label>
            <input 
              required
              name="wantedItems"
              value={formData.wantedItems}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded"
              placeholder={copy.placeholders.wanted}
            />
          </div>

          <div>
            <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">{copy.fields.description}</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full bg-black/50 border border-gundam-cyan/30 p-4 text-white focus:border-gundam-cyan outline-none transition-all rounded resize-none"
              placeholder={copy.placeholders.description}
            ></textarea>
          </div>

          <div>
             <label className="block text-[10px] text-gundam-cyan font-orbitron uppercase mb-2 tracking-[0.2em]">{copy.fields.images}</label>
             <label className="h-32 border-2 border-dashed border-gundam-cyan/30 flex flex-col items-center justify-center text-gundam-text-secondary rounded cursor-pointer hover:bg-gundam-cyan/5 transition-all">
                <span className="text-xs uppercase tracking-widest font-orbitron mb-2">{copy.placeholders.upload}</span>
                <span className="text-[10px] opacity-60">{copy.placeholders.uploadHint}</span>
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
            {loading ? copy.submitLoading : copy.submit}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/trade')}
            className="px-8 py-4 border-2 border-gundam-red text-gundam-red font-orbitron font-bold uppercase hover:bg-gundam-red/10 transition-all"
          >
            {copy.abort}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTradePage;
