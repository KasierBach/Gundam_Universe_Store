import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, SlidersHorizontal, Loader2, PackageX, AlertCircle, ShieldAlert } from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import ProductCard from '../../components/product/ProductCard'
import { cn } from '../../utils/cn'
import { PRODUCT_GRADES } from '../../shared/constants/productConstants'

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(searchParams.entries())
      const response = await productService.getProducts({ ...params, limit: 12 })
      setProducts(response?.results || [])
      setPagination({
        page: response?.page || 1,
        totalPages: response?.totalPages || 1,
        totalResults: response?.totalResults || 0
      })
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories()
      setCategories(response)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    if (key === 'page') {
      newParams.set('page', String(value))
    } else {
      newParams.set('page', '1')
    }
    setSearchParams(newParams)
  }

  const activeFiltersCount = Array.from(searchParams.keys()).filter(k => k !== 'page' && k !== 'limit').length;

  return (
    <div className="pt-20 pb-20 min-h-screen bg-gundam-bg-primary relative overflow-hidden">
      {/* Background HUD Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 border border-gundam-cyan rounded-full" />
        <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] border border-gundam-cyan rounded-full" />
        <div className="hud-scanline" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gundam-border/30 pb-8 relative">
           <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gundam-cyan/30 to-transparent" />
           <div className="absolute -bottom-[2px] left-1/4 w-1/2 h-[5px] bg-gundam-cyan/10 blur-[2px]" />
           
           <div>
              <h1 className="text-4xl font-black font-orbitron text-gundam-text-primary tracking-tighter uppercase italic">
                TACTICAL <span className="text-gundam-cyan glow-text-cyan">ARMORY</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                 <span className="w-1.5 h-1.5 bg-gundam-cyan rounded-full animate-pulse" />
                 <p className="text-gundam-text-secondary font-rajdhani uppercase tracking-[0.4em] text-[10px]">
                   STATUS: SCANNING SECTOR {pagination.page} | DETECTED: {pagination.totalResults} UNITS
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative group flex-grow md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gundam-cyan/40 group-focus-within:text-gundam-cyan transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="INPUT UNIT DESIGNATION..."
                  value={searchParams.get('name') || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="w-full bg-black/40 border border-gundam-cyan/20 text-gundam-text-primary pl-10 pr-4 py-3 rounded font-rajdhani focus:outline-none focus:border-gundam-cyan focus:shadow-cyan-glow/20 transition-all uppercase text-sm tracking-widest placeholder:opacity-30"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-6 py-3 rounded border font-orbitron text-[10px] tracking-widest uppercase transition-all flex items-center gap-3 relative overflow-hidden group",
                  showFilters ? "bg-gundam-cyan text-black border-gundam-cyan shadow-cyan-glow" : "bg-black/40 text-gundam-cyan border-gundam-cyan/30 hover:border-gundam-cyan hover:bg-gundam-cyan/5"
                )}
              >
                <SlidersHorizontal size={14} /> 
                <span>LOGISTICS {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                {!showFilters && <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />}
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0, x: -30 }}
                animate={{ width: 300, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -30 }}
                className="lg:block flex-shrink-0"
              >
                <div className="bg-gundam-dark-surface/50 border border-gundam-cyan/20 p-8 rounded shadow-2xl sticky top-24 backdrop-blur-xl">
                   <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gundam-cyan/20 rounded-tr" />
                   
                   <h3 className="font-orbitron font-bold text-[11px] text-white tracking-[0.3em] mb-8 flex items-center gap-3 uppercase">
                      <Filter size={14} className="text-gundam-cyan" /> Strategic Filters
                   </h3>
                  
                   <div className="space-y-8">
                      <FilterGroup 
                        label="PROTOCOL GRADE" 
                        options={[{_id: 'all', name: 'ALL GRADES'}, ...Object.values(PRODUCT_GRADES).map(g => ({_id: g, name: g}))]} 
                        value={searchParams.get('grade') || 'all'}
                        onChange={(val) => handleFilterChange('grade', val)}
                      />

                      <FilterGroup 
                        label="SECTOR HQ" 
                        options={[{_id: 'all', name: 'ALL CATEGORIES'}, ...categories]} 
                        value={searchParams.get('category') || 'all'}
                        onChange={(val) => handleFilterChange('category', val)}
                      />

                      {/* Price Range HUD */}
                      <div className="space-y-4">
                         <label className="text-[10px] font-orbitron text-gundam-cyan/60 uppercase tracking-widest block">Resource Threshold</label>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                               <span className="absolute left-2 top-1.5 text-[9px] text-gundam-cyan/40 font-mono">MIN</span>
                               <input 
                                 type="number" 
                                 placeholder="0"
                                 className="w-full bg-black/40 border border-white/10 p-2 pl-8 text-xs text-white outline-none focus:border-gundam-cyan transition-all rounded"
                                 value={searchParams.get('minPrice') || ''}
                                 onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                               />
                            </div>
                            <div className="relative">
                               <span className="absolute left-2 top-1.5 text-[9px] text-gundam-cyan/40 font-mono">MAX</span>
                               <input 
                                 type="number" 
                                 placeholder="9999"
                                 className="w-full bg-black/40 border border-white/10 p-2 pl-8 text-xs text-white outline-none focus:border-gundam-cyan transition-all rounded"
                                 value={searchParams.get('maxPrice') || ''}
                                 onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                               />
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                         <button 
                          onClick={() => setSearchParams({})}
                          className="w-full py-4 text-[9px] font-orbitron border border-gundam-red text-gundam-red hover:bg-gundam-red/10 transition-all uppercase tracking-[0.2em] relative group overflow-hidden"
                         >
                           <span className="relative z-10 flex items-center justify-center gap-2">
                             <AlertCircle size={12} /> System Reset
                           </span>
                           <div className="absolute inset-0 bg-gundam-red/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                         </button>
                      </div>
                   </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                 <div className="relative">
                    <Loader2 className="animate-spin text-gundam-cyan" size={64} />
                    <div className="absolute inset-0 bg-gundam-cyan/20 blur-xl rounded-full animate-pulse" />
                 </div>
                 <div className="text-center">
                    <span className="font-orbitron text-sm tracking-[0.5em] text-gundam-cyan animate-pulse block mb-2">SYNCHRONIZING FLEET DATA...</span>
                    <span className="font-rajdhani text-[10px] text-gundam-text-muted uppercase tracking-widest opacity-50">Establishing connection to colony armory</span>
                 </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
                
                {/* Pagination HUD */}
                <div className="mt-20 flex justify-center items-center gap-12 font-orbitron relative py-8 border-t border-white/5">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gundam-cyan/30" />
                   
                   <button 
                    disabled={pagination.page <= 1}
                    onClick={() => handleFilterChange('page', pagination.page - 1)}
                    className="group flex flex-col items-center gap-2 disabled:opacity-20 transition-all hover:text-gundam-cyan"
                   >
                     <span className="text-[10px] tracking-widest opacity-50 group-hover:opacity-100">PREV SECTOR</span>
                     <div className="w-12 h-0.5 bg-current opacity-30 group-hover:opacity-100 transition-all" />
                   </button>

                   <div className="text-center px-8 border-x border-white/10 group">
                      <span className="block text-[8px] text-gundam-text-muted uppercase tracking-[0.4em] mb-1">Grid Coordinate</span>
                      <span className="text-3xl font-black text-white italic group-hover:text-gundam-cyan transition-colors">
                        {pagination.page.toString().padStart(2, '0')}
                        <span className="text-gundam-text-muted text-sm font-normal mx-2 group-hover:text-white transition-colors">/</span>
                        {pagination.totalPages.toString().padStart(2, '0')}
                      </span>
                   </div>

                   <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handleFilterChange('page', pagination.page + 1)}
                    className="group flex flex-col items-center gap-2 disabled:opacity-20 transition-all hover:text-gundam-cyan"
                   >
                     <span className="text-[10px] tracking-widest opacity-50 group-hover:opacity-100">NEXT SECTOR</span>
                     <div className="w-12 h-0.5 bg-current opacity-30 group-hover:opacity-100 transition-all" />
                   </button>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[60vh] bg-black/20 border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-8 rounded-lg"
              >
                 <div className="relative">
                    <PackageX size={80} className="text-gundam-text-muted opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <ShieldAlert size={120} className="text-gundam-red opacity-10 blur-sm" />
                    </div>
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="font-orbitron font-bold text-2xl uppercase tracking-tighter text-white opacity-40 italic underline-offset-8 underline decoration-gundam-red/30 px-10">
                      NO UNITS DETECTED IN THIS SECTOR
                    </h3>
                    <p className="font-rajdhani text-gundam-text-secondary uppercase tracking-widest text-[10px] opacity-60">TACTICAL ADVICE: ADJUST FILTERS OR RESET SYSTEM SCAN</p>
                 </div>
                 <button 
                  onClick={() => setSearchParams({})}
                  className="px-8 py-3 border border-gundam-cyan text-gundam-cyan font-orbitron text-xs tracking-widest uppercase hover:bg-gundam-cyan/10 transition-all"
                 >
                   Revert to DEFAULT Sector
                 </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const FilterGroup = ({ label, options, value, onChange }) => (
  <div className="mb-8 space-y-4">
    <label className="text-[10px] font-orbitron text-gundam-cyan/60 uppercase tracking-widest block font-bold relative inline-block">
      {label}
      <div className="absolute -bottom-1 left-0 w-1/2 h-[1px] bg-gundam-cyan/30" />
    </label>
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt._id}
          onClick={() => onChange(opt._id)}
          className={cn(
            "text-left px-4 py-3 rounded font-rajdhani text-xs uppercase tracking-widest transition-all duration-300 relative group",
            value === opt._id 
              ? "bg-gundam-cyan text-black border-l-4 border-gundam-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]" 
              : "text-white/40 hover:text-white border-l-2 border-transparent hover:border-gundam-cyan/30 hover:bg-white/5"
          )}
        >
          {opt.name}
          {value !== opt._id && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-gundam-cyan/0 group-hover:bg-gundam-cyan/50 rounded-full transition-all" />
          )}
        </button>
      ))}
    </div>
  </div>
)


export default ProductPage
