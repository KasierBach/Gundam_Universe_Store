import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Tag, 
  Edit2, 
  Power, 
  LayoutGrid
} from 'lucide-react';
import categoryService from '../../services/categoryService';
import { useI18n } from '../../i18n/I18nProvider';
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy';

const CategoryManagementPage = () => {
  const { locale } = useI18n();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      title: 'Danh mục giao thức',
      subtitle: 'Hệ thống phân loại cho kho Gundam',
      newProtocol: 'Danh mục mới',
      loading: 'Đang quét cơ sở dữ liệu danh mục...',
      active: 'Đang hoạt động',
      offline: 'Tạm ẩn',
      toggleStatus: 'Đổi trạng thái',
      emptyDescription: 'Chưa có mô tả cho danh mục này.',
      protocolInitialized: 'Danh mục đã khởi tạo',
      editTitle: 'Cập nhật danh mục',
      createTitle: 'Khởi tạo danh mục mới',
      name: 'Tên danh mục',
      description: 'Mô tả',
      namePlaceholder: 'Ví dụ: MASTER GRADE (MG)',
      descriptionPlaceholder: 'Thông tin mô tả phân loại...',
      submitEdit: 'Cập nhật',
      submitCreate: 'Khởi tạo',
      abort: 'Hủy',
      errors: {
        save: 'Không thể lưu danh mục.',
        toggle: 'Không thể đổi trạng thái danh mục.',
      },
    }
    : {
      title: 'Protocol Categories',
      subtitle: 'Classification Systems for Mobile Suit Armory',
      newProtocol: 'New Protocol',
      loading: 'Scanning Category Database...',
      active: 'ACTIVE',
      offline: 'OFFLINE',
      toggleStatus: 'Toggle Status',
      emptyDescription: 'No identification data available for this protocol.',
      protocolInitialized: 'Protocol Initialized',
      editTitle: 'Protocol Update',
      createTitle: 'Initialize New Protocol',
      name: 'Protocol Name',
      description: 'Data Summary (Description)',
      namePlaceholder: 'e.g. MASTER GRADE (MG)',
      descriptionPlaceholder: 'Classification specifications...',
      submitEdit: 'Upload Sync',
      submitCreate: 'Execute Init',
      abort: 'Abort',
      errors: {
        save: 'Strategic operation failed.',
        toggle: 'Status realignment failed.',
      },
    });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      setCategories(response || []);
    } catch (err) {
      console.error('Category retrieval failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        status: category.isActive !== false ? 'active' : 'inactive'
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(copy.errors.save);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await categoryService.toggleCategoryStatus(id);
      fetchCategories();
    } catch (err) {
      alert(copy.errors.toggle);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter glow-text-cyan italic">
            {copy.title}
          </h1>
          <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.4em] mt-1 text-[10px] italic">
            {copy.subtitle}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-widest hover:bg-white transition-all shadow-cyan-glow"
        >
          <Plus size={18} /> {copy.newProtocol}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse text-gundam-cyan font-orbitron uppercase tracking-widest text-xs">
            {copy.loading}
          </div>
        ) : categories.map((cat) => (
          <motion.div 
            key={cat._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gundam-dark-surface/50 border border-gundam-cyan/10 p-6 rounded-lg hover:border-gundam-cyan/40 transition-all group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-20 h-20 bg-gundam-cyan/5 -rotate-45 translate-x-10 -translate-y-10 group-hover:bg-gundam-cyan/10 transition-all" />
             
             <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-black rounded flex items-center justify-center border border-gundam-cyan/20">
                      <Tag size={18} className="text-gundam-cyan" />
                   </div>
                   <div>
                      <h3 className="text-lg font-orbitron text-white uppercase tracking-tight">{cat.name}</h3>
                      <span className={`text-[9px] font-orbitron px-2 py-0.5 rounded border border-current tracking-tighter uppercase ${cat.isActive !== false ? 'text-gundam-emerald bg-gundam-emerald/5' : 'text-gundam-red bg-gundam-red/5'}`}>
                        {cat.isActive !== false ? copy.active : copy.offline}
                      </span>
                   </div>
                </div>
                <div className="flex gap-1">
                   <button 
                     onClick={() => handleOpenModal(cat)}
                     className="p-2 text-gundam-text-muted hover:text-white hover:bg-white/5 rounded"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button 
                     onClick={() => handleToggleStatus(cat._id)}
                     className="p-2 text-gundam-text-muted hover:text-gundam-amber hover:bg-gundam-amber/5 rounded"
                     title={copy.toggleStatus}
                   >
                     <Power size={16} />
                   </button>
                </div>
             </div>
             
             <p className="text-xs text-gundam-text-muted font-rajdhani line-clamp-2 italic h-8 opacity-70">
                {cat.description || copy.emptyDescription}
             </p>
             
             <div className="mt-6 flex items-center justify-between text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">
                <span>Ref: {cat._id.slice(-8).toUpperCase()}</span>
                <span className="opacity-30 group-hover:opacity-100 transition-opacity">{copy.protocolInitialized}</span>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Modal HUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-gundam-dark-surface border border-gundam-cyan/30 p-8 rounded-lg shadow-cyan-glow/20"
            >
              <h2 className="text-xl font-orbitron text-white uppercase tracking-widest mb-8 border-l-4 border-gundam-cyan pl-4">
                {editingCategory ? copy.editTitle : copy.createTitle}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest">{copy.name}</label>
                    <input 
                      required
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gundam-cyan outline-none rounded transition-all italic tracking-widest"
                      placeholder={copy.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest">{copy.description}</label>
                    <textarea 
                      rows="3"
                      className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-gundam-cyan outline-none rounded transition-all italic font-rajdhani"
                      placeholder={copy.descriptionPlaceholder}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                   <button 
                     type="submit"
                     className="flex-1 py-4 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-cyan-glow"
                   >
                     {editingCategory ? copy.submitEdit : copy.submitCreate}
                   </button>
                   <button 
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     className="px-6 py-4 border border-white/10 text-white font-orbitron text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                   >
                     {copy.abort}
                   </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagementPage;
