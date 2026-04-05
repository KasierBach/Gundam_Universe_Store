import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  Image as ImageIcon,
  Check,
  X,
} from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import sellerService from '../../services/sellerService'
import { PRODUCT_GRADES } from '../../shared/constants/productConstants'
import ModelKitImage from '../../components/shared/ModelKitImage'
import useAuthStore from '../../stores/authStore'
import { useI18n } from '../../i18n/I18nProvider'
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy'

const ProductManagementPage = () => {
  const { locale } = useI18n()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const { user } = useAuthStore()
  const isSellerMode = user?.role === 'seller'

  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      sellerTitle: 'Kho sản phẩm seller',
      adminTitle: 'Quản lý sản phẩm',
      sellerSubtitle: 'Chế độ seller: điều phối tồn kho và danh mục bán',
      adminSubtitle: 'Chế độ admin: kiểm soát catalog toàn hệ thống',
      newEntry: 'Thêm sản phẩm',
      searchPlaceholder: 'Tìm theo tên sản phẩm hoặc series...',
      totalUnits: 'Tổng sản phẩm',
      headers: ['Thông tin', 'Giá', 'Tồn kho', 'Grade / Series', 'Tác vụ'],
      loading: 'Đang đồng bộ dữ liệu sản phẩm...',
      defaultCategory: 'Mô hình Gundam',
      units: 'mẫu',
      imageRequired: 'Vui lòng tải lên ít nhất một ảnh sản phẩm.',
      saveFailed: 'Không thể lưu sản phẩm.',
      deleteConfirm: 'Xác nhận xóa sản phẩm này?',
      deleteFailed: 'Không thể xóa sản phẩm.',
      editTitle: 'Cập nhật sản phẩm',
      createTitle: 'Khởi tạo sản phẩm mới',
      fields: {
        name: 'Tên sản phẩm',
        price: 'Giá bán ($)',
        stock: 'Tồn kho',
        grade: 'Grade',
        category: 'Danh mục',
        images: 'Hình ảnh',
        description: 'Mô tả tiếng Anh',
        descriptionVi: 'Mô tả tiếng Việt',
      },
      placeholders: {
        name: 'Ví dụ: RX-78-2 Gundam',
        price: '99.99',
        imagesTitle: 'Tải ảnh sản phẩm',
        imagesHint: 'PNG, JPG, WEBP tối đa 5MB mỗi ảnh',
        description: 'Thông số và mô tả chi tiết...',
        descriptionVi: 'Mô tả tiếng Việt hiển thị khi người dùng chọn VI...',
      },
      submit: 'Lưu sản phẩm',
      abort: 'Hủy',
    }
    : {
      sellerTitle: 'Seller Armory Deck',
      adminTitle: 'Armory Management',
      sellerSubtitle: 'System Identity: Seller Inventory Control',
      adminSubtitle: 'System Identity: Inventory Controller Alpha',
      newEntry: 'New Model Entry',
      searchPlaceholder: 'Search Armory by Model Name or Series...',
      totalUnits: 'Total Units',
      headers: ['Unit Info', 'Resource (Price)', 'Inventory', 'Grade/Series', 'Actions'],
      loading: 'Synchronizing Armory Database...',
      defaultCategory: 'Gundam Model',
      units: 'units',
      imageRequired: 'Please upload at least one product image.',
      saveFailed: 'Operation failed. Check tactical logs.',
      deleteConfirm: 'Confirm termination of this model record?',
      deleteFailed: 'Termination failed.',
      editTitle: 'Reconfigure Model Specs',
      createTitle: 'Initialize New Model Record',
      fields: {
        name: 'Model Nomenclature',
        price: 'Market Value ($)',
        stock: 'Unit Inventory',
        grade: 'Protocol Grade',
        category: 'Sector HQ (Category)',
        images: 'Visual Databank (Images)',
        description: 'Decrypted Specs (Description)',
        descriptionVi: 'Vietnamese Specs (Description VI)',
      },
      placeholders: {
        name: 'e.g. RX-78-2 Gundam',
        price: '99.99',
        imagesTitle: 'Upload product images',
        imagesHint: 'PNG, JPG, WEBP up to 5MB each',
        description: 'Detailed model specifications...',
        descriptionVi: 'Vietnamese description shown when users select VI...',
      },
      submit: 'Confirm Transmission',
      abort: 'Abort',
    })

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    grade: 'NONE',
    series: 'Universal Century',
    description: '',
    descriptionVi: '',
    images: [{ url: '', publicId: 'manually_added', isMain: true }],
  })

  const grades = Object.values(PRODUCT_GRADES)

  useEffect(() => {
    fetchData()
  }, [isSellerMode])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        isSellerMode ? sellerService.getProducts() : productService.getProducts({ limit: 100 }),
        categoryService.getCategories(),
      ])
      setProducts(isSellerMode ? (prodRes || []) : (prodRes?.results || []))
      setCategories(catRes || [])
    } catch (err) {
      console.error('Data acquisition failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category._id || product.category,
        grade: product.grade || 'NONE',
        series: product.series || 'Universal Century',
        description: product.description,
        descriptionVi: product.descriptionVi || '',
        images: product.images.length > 0 ? product.images : [{ url: '', publicId: 'manually_added', isMain: true }],
      })
      setImageFiles([])
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: categories[0]?._id || '',
        grade: PRODUCT_GRADES.NONE,
        series: 'Universal Century',
        description: '',
        descriptionVi: '',
        images: [],
      })
      setImageFiles([])
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('price', formData.price)
      payload.append('stock', formData.stock)
      payload.append('category', formData.category)
      payload.append('grade', formData.grade)
      payload.append('series', formData.series)
      payload.append('description', formData.description)
      payload.append('descriptionVi', formData.descriptionVi)

      if (editingProduct && imageFiles.length === 0) {
        payload.append('images', JSON.stringify(formData.images))
      }

      imageFiles.forEach((file) => {
        payload.append('images', file)
      })

      if (!editingProduct && imageFiles.length === 0) {
        alert(copy.imageRequired)
        return
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload)
      } else {
        await productService.createProduct(payload)
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      alert(copy.saveFailed)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(copy.deleteConfirm)) return
    try {
      await productService.deleteProduct(id)
      fetchData()
    } catch (err) {
      alert(copy.deleteFailed)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.series.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter glow-text italic">
            {isSellerMode ? copy.sellerTitle : copy.adminTitle}
          </h1>
          <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.4em] mt-1 text-[10px] italic">
            {isSellerMode ? copy.sellerSubtitle : copy.adminSubtitle}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-widest hover:bg-white transition-all shadow-cyan-glow"
        >
          <Plus size={18} /> {copy.newEntry}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gundam-cyan/50" size={18} />
          <input
            type="text"
            placeholder={copy.searchPlaceholder}
            className="w-full bg-gundam-dark-surface/50 border border-gundam-cyan/20 p-4 pl-12 text-white font-rajdhani focus:border-gundam-cyan outline-none transition-all rounded-lg"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 px-4 bg-gundam-dark-surface/50 border border-gundam-cyan/20 rounded-lg text-gundam-text-muted font-orbitron text-[10px] uppercase">
          <Filter size={14} className="text-gundam-cyan" />
          <span>{copy.totalUnits}: {filteredProducts.length}</span>
        </div>
      </div>

      <div className="bg-gundam-dark-surface/30 border border-gundam-cyan/10 rounded-lg overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-rajdhani">
            <thead>
              <tr className="bg-black/40 border-b border-gundam-cyan/20 text-[10px] font-orbitron text-gundam-cyan uppercase tracking-widest">
                {copy.headers.map((header, index) => (
                  <th key={header} className={index === copy.headers.length - 1 ? 'p-5 text-right' : 'p-5'}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center animate-pulse text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">
                    {copy.loading}
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-white/5 transition-all group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded border border-gundam-cyan/20 p-1 flex-shrink-0">
                        <ModelKitImage
                          src={product.images[0]?.url}
                          alt={product.name}
                          name={product.name}
                          grade={product.grade}
                          series={product.series}
                          imageClassName="grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div>
                        <div className="text-white font-bold tracking-tight uppercase line-clamp-1">{product.name}</div>
                        <div className="text-[9px] text-gundam-text-muted uppercase font-orbitron">
                          {product.category?.name || copy.defaultCategory}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-white font-mono font-bold italic tracking-wider">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-gundam-emerald' : 'bg-gundam-red animate-pulse shadow-[0_0_8px_red]'}`} />
                      <span className="text-white font-bold">{product.stock} {copy.units}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gundam-cyan font-orbitron uppercase tracking-tighter">{product.grade}</span>
                      <span className="text-[10px] text-gundam-text-muted italic">{product.series}</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gundam-text-muted hover:text-white hover:bg-white/10 rounded transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-gundam-text-muted hover:text-gundam-red hover:bg-gundam-red/10 rounded transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-gundam-dark-surface border border-gundam-cyan p-8 rounded-lg shadow-cyan-glow/20"
            >
              <h2 className="text-2xl font-orbitron text-white uppercase tracking-widest mb-8 border-l-4 border-gundam-cyan pl-4">
                {editingProduct ? copy.editTitle : copy.createTitle}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={copy.fields.name} icon={<Package size={16} className="text-gundam-cyan opacity-50" />}>
                    <input
                      required
                      className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-white focus:border-gundam-cyan outline-none rounded transition-all"
                      placeholder={copy.placeholders.name}
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    />
                  </Field>

                  <Field label={copy.fields.price} icon={<DollarSign size={16} className="text-gundam-cyan opacity-50" />}>
                    <input
                      required
                      type="number"
                      className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-white focus:border-gundam-cyan outline-none rounded transition-all"
                      placeholder={copy.placeholders.price}
                      value={formData.price}
                      onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                    />
                  </Field>

                  <Field label={copy.fields.stock}>
                    <input
                      required
                      type="number"
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gundam-cyan outline-none rounded transition-all"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(event) => setFormData({ ...formData, stock: event.target.value })}
                    />
                  </Field>

                  <Field label={copy.fields.grade}>
                    <select
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gundam-cyan outline-none rounded transition-all"
                      value={formData.grade}
                      onChange={(event) => setFormData({ ...formData, grade: event.target.value })}
                    >
                      {grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label={copy.fields.category}>
                  <select
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gundam-cyan outline-none rounded transition-all"
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                  >
                    {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
                  </select>
                </Field>

                <Field label={copy.fields.images}>
                  <div className="space-y-3">
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-gundam-cyan/30 bg-black/30 px-4 text-center hover:bg-gundam-cyan/5 transition-all">
                      <ImageIcon className="mb-2 text-gundam-cyan opacity-60" size={18} />
                      <span className="text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan">{copy.placeholders.imagesTitle}</span>
                      <span className="mt-1 text-[10px] text-gundam-text-muted">{copy.placeholders.imagesHint}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
                      />
                    </label>

                    {imageFiles.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {imageFiles.map((file) => (
                          <div key={`${file.name}-${file.size}`} className="rounded border border-gundam-cyan/20 bg-black/30 p-2 text-[10px] text-gundam-text-secondary truncate">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    ) : editingProduct?.images?.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {editingProduct.images.map((image) => (
                          <div key={image.publicId || image.url} className="aspect-square rounded border border-gundam-cyan/20 bg-black/30 overflow-hidden">
                            <img src={image.url} alt={editingProduct.name} className="w-full h-full object-contain p-2" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Field>

                <Field label={copy.fields.description}>
                  <textarea
                    rows="3"
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-gundam-cyan outline-none rounded transition-all italic font-rajdhani"
                    placeholder={copy.placeholders.description}
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  />
                </Field>

                <Field label={copy.fields.descriptionVi}>
                  <textarea
                    rows="3"
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-gundam-cyan outline-none rounded transition-all font-bevietnam"
                    placeholder={copy.placeholders.descriptionVi}
                    value={formData.descriptionVi}
                    onChange={(event) => setFormData({ ...formData, descriptionVi: event.target.value })}
                  />
                </Field>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-cyan-glow flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> {copy.submit}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 border border-gundam-red text-gundam-red font-orbitron font-bold uppercase tracking-widest hover:bg-gundam-red/10 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} /> {copy.abort}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Field = ({ label, icon, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] text-gundam-cyan font-orbitron uppercase tracking-widest">{label}</label>
    <div className="relative">
      {icon ? <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div> : null}
      {children}
    </div>
  </div>
)

export default ProductManagementPage
