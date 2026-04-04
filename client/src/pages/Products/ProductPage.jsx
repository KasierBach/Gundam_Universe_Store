import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowUpDown,
  Filter,
  Loader2,
  PackageX,
  Radar,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import ProductCard from '../../components/product/ProductCard'
import { cn } from '../../utils/cn'
import { PRODUCT_GRADES } from '../../shared/constants/productConstants'
import { useI18n } from '../../i18n/I18nProvider'

const ProductPage = () => {
  const { t, tv } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 })

  const sortOptions = useMemo(
    () => [
      { label: t('product.listing.sort.latest'), value: 'createdAt:desc' },
      { label: t('product.listing.sort.viewed'), value: 'views:desc' },
      { label: t('product.listing.sort.priceAsc'), value: 'price:asc' },
      { label: t('product.listing.sort.priceDesc'), value: 'price:desc' },
      { label: t('product.listing.sort.rated'), value: 'ratings.average:desc' },
    ],
    [t]
  )

  const quickSignalCopy = useMemo(
    () => [
      { label: t('product.listing.activeCatalog'), value: t('product.listing.liveDrops') },
      { label: t('product.listing.intelGrade'), value: t('product.listing.curated') },
      { label: t('product.listing.hangarMode'), value: t('product.listing.responsive') },
    ],
    [t]
  )

  const selectedSort = `${searchParams.get('sortBy') || 'createdAt'}:${searchParams.get('order') || 'desc'}`

  const activeFilters = useMemo(
    () => Array.from(searchParams.entries()).filter(([key]) => key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'order'),
    [searchParams]
  )

  const featuredProducts = products.slice(0, 3)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(searchParams.entries())
      const response = await productService.getProducts({ ...params, limit: 12 })
      setProducts(response?.results || [])
      setPagination({
        page: response?.page || 1,
        totalPages: response?.totalPages || 1,
        totalResults: response?.totalResults || 0,
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

    if (key !== 'page') {
      newParams.set('page', '1')
    }

    setSearchParams(newParams)
  }

  const handleSortChange = (value) => {
    const [sortBy, order] = value.split(':')
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sortBy', sortBy)
    newParams.set('order', order)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setSearchParams({
      sortBy: searchParams.get('sortBy') || 'createdAt',
      order: searchParams.get('order') || 'desc',
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gundam-bg-primary pb-20 pt-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full border border-gundam-cyan" />
        <div className="absolute bottom-24 right-[8%] h-[28rem] w-[28rem] rounded-full border border-gundam-cyan" />
        <div className="hud-scanline" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <section className="overflow-hidden rounded-[2rem] border border-gundam-border/40 bg-[linear-gradient(130deg,rgba(9,16,29,0.96),rgba(4,8,18,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gundam-cyan/20 bg-gundam-cyan/10 px-4 py-2 text-[10px] font-orbitron uppercase tracking-[0.32em] text-gundam-cyan">
                <Radar size={14} /> {t('product.listing.heroBadge')}
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t('product.listing.titleLine1')}
                <span className="block text-gundam-cyan glow-text-cyan">{t('product.listing.titleLine2')}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gundam-text-secondary sm:text-lg">
                {t('product.listing.description')}
              </p>

              <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gundam-cyan/40" size={18} />
                  <input
                    type="text"
                    placeholder={t('product.listing.searchPlaceholder')}
                    value={searchParams.get('name') || ''}
                    onChange={(event) => handleFilterChange('name', event.target.value)}
                    className="w-full rounded-2xl border border-gundam-border/40 bg-black/35 py-4 pl-12 pr-4 text-sm text-gundam-text-primary outline-none transition-all placeholder:text-gundam-text-muted/60 focus:border-gundam-cyan focus:shadow-cyan-glow/20"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative min-w-[220px]">
                    <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gundam-cyan/40" size={16} />
                    <select
                      value={selectedSort}
                      onChange={(event) => handleSortChange(event.target.value)}
                      className="w-full appearance-none rounded-2xl border border-gundam-border/40 bg-black/35 py-4 pl-12 pr-10 text-sm text-gundam-text-primary outline-none transition-all focus:border-gundam-cyan"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    onClick={() => setShowFilters((value) => !value)}
                    className={cn(
                      'inline-flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-[11px] font-orbitron uppercase tracking-[0.24em] transition-all',
                      showFilters
                        ? 'border-gundam-cyan bg-gundam-cyan text-gundam-bg-primary shadow-cyan-glow'
                        : 'border-gundam-cyan/30 bg-black/35 text-gundam-cyan hover:border-gundam-cyan hover:bg-gundam-cyan/10'
                    )}
                  >
                    <SlidersHorizontal size={16} /> {t('product.listing.logistics')} {activeFilters.length > 0 ? `(${activeFilters.length})` : ''}
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <GradeChip
                  label={t('common.allFrames')}
                  active={!searchParams.get('grade')}
                  onClick={() => handleFilterChange('grade', 'all')}
                />
                {Object.values(PRODUCT_GRADES)
                  .filter((grade) => [PRODUCT_GRADES.HG, PRODUCT_GRADES.RG, PRODUCT_GRADES.MG, PRODUCT_GRADES.PG].includes(grade))
                  .map((grade) => (
                    <GradeChip
                      key={grade}
                      label={tv('grade', grade)}
                      active={searchParams.get('grade') === grade}
                      onClick={() => handleFilterChange('grade', grade)}
                    />
                  ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1 xl:grid-rows-[auto_auto_1fr]">
              <div className="rounded-[1.75rem] border border-gundam-border/30 bg-black/25 p-5">
                <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">{t('product.listing.scan')}</p>
                <p className="mt-4 text-4xl font-black text-white">{pagination.totalResults}</p>
                <p className="mt-2 text-sm text-gundam-text-secondary">{t('product.listing.kitsCount')}</p>
              </div>

              <div className="rounded-[1.75rem] border border-gundam-border/30 bg-black/25 p-5">
                <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">{t('product.listing.pageVector')}</p>
                <p className="mt-4 text-4xl font-black text-gundam-cyan">
                  {pagination.page.toString().padStart(2, '0')}
                  <span className="mx-2 text-gundam-text-muted">/</span>
                  {pagination.totalPages.toString().padStart(2, '0')}
                </p>
                <p className="mt-2 text-sm text-gundam-text-secondary">{t('product.listing.gridDescription')}</p>
              </div>

              <div className="rounded-[1.75rem] border border-gundam-border/30 bg-[linear-gradient(180deg,rgba(0,243,255,0.08),rgba(0,0,0,0.12))] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-cyan">{t('product.listing.featuredBadge')}</p>
                    <p className="mt-2 text-lg font-orbitron font-black text-white">{t('product.listing.responsive')}</p>
                  </div>
                  <Sparkles className="text-gundam-cyan" size={20} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  {quickSignalCopy.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-muted">{item.label}</p>
                      <p className="mt-2 text-sm font-orbitron font-bold uppercase text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {activeFilters.length > 0 ? (
            <>
              {activeFilters.map(([key, value]) => (
                <button
                  key={`${key}-${value}`}
                  onClick={() => handleFilterChange(key, 'all')}
                  className="rounded-full border border-gundam-cyan/20 bg-gundam-cyan/10 px-4 py-2 text-[10px] font-orbitron uppercase tracking-[0.22em] text-gundam-cyan transition-colors hover:bg-gundam-cyan/20"
                >
                  {key}: {value}
                </button>
              ))}
              <button
                onClick={clearAllFilters}
                className="rounded-full border border-gundam-red/30 bg-gundam-red/10 px-4 py-2 text-[10px] font-orbitron uppercase tracking-[0.22em] text-gundam-red transition-colors hover:bg-gundam-red/20"
              >
                {t('product.listing.clear')}
              </button>
            </>
          ) : (
            <p className="text-xs uppercase tracking-[0.28em] text-gundam-text-muted">
              {t('product.listing.noFilters')}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-8 xl:flex-row">
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -24, width: 0 }}
                animate={{ opacity: 1, x: 0, width: '100%' }}
                exit={{ opacity: 0, x: -24, width: 0 }}
                className="w-full overflow-hidden xl:max-w-[320px]"
              >
                <div className="sticky top-24 rounded-[1.75rem] border border-gundam-border/30 bg-[linear-gradient(180deg,rgba(9,15,28,0.98),rgba(3,8,18,0.98))] p-6 shadow-2xl">
                  <div className="mb-8 flex items-center gap-3">
                    <Filter className="text-gundam-cyan" size={16} />
                    <h2 className="text-[11px] font-orbitron font-bold uppercase tracking-[0.3em] text-white">{t('product.listing.filters.title')}</h2>
                  </div>

                  <div className="space-y-8">
                    <FilterGroup
                      label={t('product.listing.filters.protocolGrade')}
                      options={[{ _id: 'all', name: t('product.listing.filters.allGrades') }, ...Object.values(PRODUCT_GRADES).map((grade) => ({ _id: grade, name: tv('grade', grade) }))]}
                      value={searchParams.get('grade') || 'all'}
                      onChange={(value) => handleFilterChange('grade', value)}
                    />

                    <FilterGroup
                      label={t('product.listing.filters.sector')}
                      options={[{ _id: 'all', name: t('product.listing.filters.allCategories') }, ...categories]}
                      value={searchParams.get('category') || 'all'}
                      onChange={(value) => handleFilterChange('category', value)}
                    />

                    <div className="space-y-4">
                      <label className="block text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-cyan/70">{t('product.listing.filters.threshold')}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <PriceInput
                          label={t('product.listing.filters.min')}
                          placeholder="0"
                          value={searchParams.get('minPrice') || ''}
                          onChange={(value) => handleFilterChange('minPrice', value)}
                        />
                        <PriceInput
                          label={t('product.listing.filters.max')}
                          placeholder="999"
                          value={searchParams.get('maxPrice') || ''}
                          onChange={(value) => handleFilterChange('maxPrice', value)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={clearAllFilters}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gundam-red px-4 py-4 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-red transition-colors hover:bg-gundam-red/10"
                    >
                      <AlertCircle size={14} /> {t('product.listing.filters.reset')}
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="min-w-0 flex-1">
            {!loading && featuredProducts.length > 0 && (
              <section className="mb-10">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.3em] text-gundam-cyan">{t('product.listing.featuredBadge')}</p>
                    <h2 className="mt-2 text-2xl font-orbitron font-black uppercase tracking-tight text-white">
                      {t('product.listing.featuredTitle')}
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm text-gundam-text-secondary">
                    {t('product.listing.featuredDescription')}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                  {featuredProducts.map((product) => (
                    <ProductCard key={`featured-${product._id}`} product={product} priority />
                  ))}
                </div>
              </section>
            )}

            {loading ? (
              <div className="flex h-[55vh] flex-col items-center justify-center gap-6 rounded-[2rem] border border-gundam-border/20 bg-black/10">
                <div className="relative">
                  <Loader2 className="animate-spin text-gundam-cyan" size={64} />
                  <div className="absolute inset-0 rounded-full bg-gundam-cyan/20 blur-xl" />
                </div>
                <div className="text-center">
                  <span className="mb-2 block text-sm font-orbitron uppercase tracking-[0.45em] text-gundam-cyan">{t('product.listing.loading.title')}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gundam-text-muted">{t('product.listing.loading.subtitle')}</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">{t('product.listing.gridStatus')}</p>
                    <h3 className="mt-2 text-xl font-orbitron font-black uppercase tracking-tight text-white">
                      {t('product.listing.unitsAvailable', { count: pagination.totalResults })}
                    </h3>
                  </div>
                  <p className="text-sm text-gundam-text-secondary">
                    {t('product.listing.gridDescription')}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3"
                >
                  {products.map((product, index) => (
                    <ProductCard key={product._id} product={product} priority={index < 3} />
                  ))}
                </motion.div>

                <div className="mt-14 flex flex-col items-center justify-center gap-6 rounded-[1.75rem] border border-gundam-border/20 bg-black/10 px-6 py-8 sm:flex-row">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => handleFilterChange('page', String(pagination.page - 1))}
                    className="min-w-[180px] rounded-full border border-gundam-border/30 px-6 py-3 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-secondary transition-colors hover:border-gundam-cyan hover:text-gundam-cyan disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {t('product.listing.previous')}
                  </button>

                  <div className="text-center">
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.3em] text-gundam-text-muted">{t('product.listing.pageVector')}</p>
                    <p className="mt-2 text-3xl font-orbitron font-black text-white">
                      {pagination.page.toString().padStart(2, '0')}
                      <span className="mx-2 text-gundam-text-muted">/</span>
                      {pagination.totalPages.toString().padStart(2, '0')}
                    </p>
                  </div>

                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handleFilterChange('page', String(pagination.page + 1))}
                    className="min-w-[180px] rounded-full border border-gundam-border/30 px-6 py-3 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-secondary transition-colors hover:border-gundam-cyan hover:text-gundam-cyan disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {t('product.listing.next')}
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-[55vh] flex-col items-center justify-center gap-8 rounded-[2rem] border-2 border-dashed border-white/8 bg-black/10 px-6 text-center"
              >
                <div className="relative">
                  <PackageX size={76} className="text-gundam-text-muted opacity-25" />
                  <ShieldAlert size={108} className="absolute inset-0 m-auto text-gundam-red/20 blur-sm" />
                </div>
                <div>
                  <h3 className="text-2xl font-orbitron font-black uppercase tracking-tight text-white/70">
                    {t('product.listing.noResultTitle')}
                  </h3>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-gundam-text-muted">
                    {t('product.listing.noResultHint')}
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="rounded-full border border-gundam-cyan px-6 py-3 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-cyan transition-colors hover:bg-gundam-cyan/10"
                >
                  {t('product.listing.revert')}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const GradeChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'rounded-full border px-4 py-2 text-[10px] font-orbitron uppercase tracking-[0.22em] transition-all',
      active
        ? 'border-gundam-cyan bg-gundam-cyan text-gundam-bg-primary shadow-cyan-glow'
        : 'border-gundam-border/40 bg-black/20 text-gundam-text-secondary hover:border-gundam-cyan/40 hover:text-gundam-cyan'
    )}
  >
    {label}
  </button>
)

const FilterGroup = ({ label, options, value, onChange }) => (
  <div className="space-y-4">
    <label className="inline-block text-[10px] font-orbitron font-bold uppercase tracking-[0.28em] text-gundam-cyan/70">
      {label}
    </label>
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option._id}
          onClick={() => onChange(option._id)}
          className={cn(
            'rounded-2xl px-4 py-3 text-left text-xs uppercase tracking-[0.22em] transition-all',
            value === option._id
              ? 'border-l-4 border-gundam-cyan bg-gundam-cyan text-gundam-bg-primary shadow-[0_0_18px_rgba(0,243,255,0.2)]'
              : 'border-l-2 border-transparent bg-black/20 text-gundam-text-secondary hover:border-gundam-cyan/30 hover:bg-white/5 hover:text-white'
          )}
        >
          {option.name}
        </button>
      ))}
    </div>
  </div>
)

const PriceInput = ({ label, placeholder, value, onChange }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-orbitron uppercase tracking-[0.2em] text-gundam-cyan/50">
      {label}
    </span>
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-gundam-border/20 bg-black/35 py-3 pl-12 pr-3 text-sm text-white outline-none transition-colors focus:border-gundam-cyan"
    />
  </div>
)

export default ProductPage
