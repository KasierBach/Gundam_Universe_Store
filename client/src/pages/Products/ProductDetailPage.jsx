import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  Eye,
  Loader2,
  PackageX,
  Radar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from 'lucide-react'
import productService from '../../services/productService'
import AddToCartButton from '../../components/cart/AddToCartButton'
import StartConversationButton from '../../components/chat/StartConversationButton'
import ProductCard from '../../components/product/ProductCard'
import ReviewSection from '../../components/product/ReviewSection'
import WishlistButton from '../../components/wishlist/WishlistButton'
import SeoHead from '../../components/shared/SeoHead'
import { cn } from '../../utils/cn'
import ModelKitImage from '../../components/shared/ModelKitImage'
import { useI18n } from '../../i18n/I18nProvider'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const { locale, t, tv } = useI18n()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await productService.getProductBySlug(slug)
        setProduct(response)
        const relatedProducts = await productService.getRecommendations(slug, { limit: 4 })
        setRecommendations(relatedProducts || [])
      } catch (error) {
        console.error('Failed to fetch product details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  useEffect(() => {
    setSelectedImage(0)
    setQuantity(1)
  }, [slug])

  const mainImages = useMemo(() => (product?.images?.length ? product.images : [{ url: '', isMain: true }]), [product])
  const stockTone = product?.stock > 6 ? 'safe' : product?.stock > 0 ? 'warning' : 'danger'
  const productDescription = locale === 'vi' && product?.descriptionVi ? product.descriptionVi : product?.description
  const seoDescription = productDescription?.slice(0, 155)

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gundam-bg-primary">
        <Loader2 className="animate-spin text-gundam-cyan" size={64} />
        <span className="text-xs font-orbitron uppercase tracking-[0.5em] text-gundam-cyan/70">{t('product.detail.loading')}</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gundam-bg-primary px-4 pt-32 text-center">
        <PackageX size={80} className="mb-6 text-gundam-red opacity-30" />
        <h1 className="mb-4 text-3xl font-orbitron font-black uppercase text-gundam-text-primary">{t('product.detail.notFoundTitle')}</h1>
        <p className="mb-8 text-gundam-text-secondary">{t('product.detail.notFoundDescription')}</p>
        <Link to="/shop" className="btn btn-primary px-8 py-3">{t('product.detail.backToShop')}</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gundam-bg-primary pb-24 pt-24">
      <SeoHead
        locale={locale}
        path={`/products/${slug}`}
        type="product"
        title={product.name}
        description={
          seoDescription ||
          (locale === 'vi'
            ? 'Chi tiết sản phẩm Gundam với hình ảnh, thông số, định giá mô phỏng và gợi ý sản phẩm liên quan.'
            : 'Detailed Gundam product page with gallery, specs, simulated valuation, and related recommendations.')
        }
        keywords={`${product.name}, ${product.series}, ${product.grade}, ${product.rarity}, Gundam, Gunpla`}
        image={mainImages[0]?.url || '/og-cover.svg'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: productDescription,
          image: mainImages.map((image) => image.url).filter(Boolean),
          sku: product._id,
          category: product.category?.name,
          brand: {
            '@type': 'Brand',
            name: 'Bandai / Gunpla',
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://gundam-universe-store.vercel.app/products/${slug}`,
          },
          aggregateRating: product.ratings?.count
            ? {
              '@type': 'AggregateRating',
              ratingValue: product.ratings.average,
              reviewCount: product.ratings.count,
            }
            : undefined,
        }}
      />
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">
          <Link to="/" className="hover:text-gundam-cyan">{t('product.detail.home')}</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-gundam-cyan">{t('product.detail.shop')}</Link>
          <ChevronRight size={12} />
          <span className="text-gundam-cyan">{product.name}</span>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-gundam-border/35 bg-[linear-gradient(145deg,rgba(9,16,29,0.98),rgba(3,7,17,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0">
              <div className="grid gap-4 lg:grid-cols-[110px_1fr]">
                <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible">
                  {mainImages.map((image, index) => (
                    <button
                      key={`${image.publicId || image.url}-${index}`}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border bg-black/20 p-1 transition-all',
                        selectedImage === index
                          ? 'border-gundam-cyan bg-gundam-cyan/10 shadow-cyan-glow'
                          : 'border-gundam-border/25 hover:border-gundam-cyan/40'
                      )}
                    >
                      <ModelKitImage
                        src={image.url}
                        alt={`${product.name}-${index + 1}`}
                        name={product.name}
                        grade={product.grade}
                        series={product.series}
                      />
                    </button>
                  ))}
                </div>

                <div className="order-1 space-y-5 lg:order-2">
                  <div className="relative aspect-[0.98] overflow-hidden rounded-[1.9rem] border border-gundam-border/30 bg-[linear-gradient(180deg,rgba(11,18,33,0.85),rgba(1,5,14,0.96))]">
                    <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-gundam-cyan/25 bg-black/35 px-4 py-2 text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-cyan">
                      <Radar size={14} /> {t('product.detail.visualFeed')}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        className="h-full w-full"
                      >
                        <ModelKitImage
                          src={mainImages[selectedImage]?.url}
                          alt={product.name}
                          name={product.name}
                          grade={product.grade}
                          series={product.series}
                          imageClassName="p-8 sm:p-10"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,12,0)_55%,rgba(2,5,12,0.8)_100%)]" />
                    <div className="pointer-events-none absolute inset-0 hud-scanline opacity-10" />
                    <div className="absolute bottom-5 left-5 z-20 flex flex-wrap gap-2">
                      <DetailBadge value={tv('grade', product.grade)} tone="cyan" />
                      <DetailBadge value={tv('rarity', product.rarity)} tone="amber" />
                      <DetailBadge value={tv('condition', product.condition)} tone="neutral" />
                    </div>
                    <div className="absolute bottom-5 right-5 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.22em] text-gundam-text-muted">
                      Ref {product._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <SignalCard label={t('product.detail.seriesLabel')} value={product.series} compact />
                    <SignalCard label={t('product.detail.viewsLabel')} value={(product.views || 0).toLocaleString()} compact />
                    <SignalCard
                      label={t('product.detail.reviewsLabel')}
                      value={product.ratings?.count ? `${product.ratings.average?.toFixed(1)} / 5` : t('product.card.noData')}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-[1.9rem] border border-gundam-border/30 bg-[linear-gradient(180deg,rgba(9,16,29,0.76),rgba(4,8,18,0.96))] p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <DetailBadge value={tv('grade', product.grade)} tone="cyan" />
                  <DetailBadge value={tv('rarity', product.rarity)} tone="amber" />
                  <span className="text-sm uppercase tracking-[0.22em] text-gundam-text-muted">{product.series}</span>
                </div>

                <h1 className="mt-5 text-3xl font-orbitron font-black uppercase leading-tight text-white sm:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gundam-text-secondary">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={16} className="text-gundam-emerald" />
                    {t('product.detail.genuine')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Eye size={16} className="text-gundam-cyan" />
                    {t('product.detail.views', { count: (product.views || 0).toLocaleString() })}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-gundam-border/20 py-6">
                  <div>
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">{t('product.detail.deploymentCost')}</p>
                    <p className="mt-2 text-4xl font-orbitron font-black text-gundam-cyan">${product.price.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-gundam-border/20 bg-black/20 px-4 py-3">
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-muted">{t('product.card.stock')}</p>
                    <p className={cn(
                      'mt-2 text-sm font-orbitron font-bold uppercase',
                      stockTone === 'safe' && 'text-gundam-emerald',
                      stockTone === 'warning' && 'text-gundam-amber',
                      stockTone === 'danger' && 'text-gundam-red'
                    )}>
                      {product.stock > 0 ? t('product.detail.stockReady', { count: product.stock }) : t('product.detail.outOfStock')}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-base leading-7 text-gundam-text-secondary">{productDescription}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <SignalCard label={t('product.detail.scale')} value={product.specs?.scale || 'N/A'} />
                  <SignalCard label={t('product.detail.material')} value={product.specs?.material || 'N/A'} />
                  <SignalCard label={t('product.detail.dimensions')} value={product.specs?.dimensions || 'N/A'} />
                  <SignalCard label={t('product.detail.weight')} value={product.specs?.weight || 'N/A'} />
                </div>

                <div className="mt-6 rounded-[1.6rem] border border-gundam-border/20 bg-black/20 p-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-gundam-border/30 bg-gundam-bg-primary">
                      <button
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        className="px-4 py-3 text-lg transition-colors hover:bg-gundam-cyan/10"
                      >
                        -
                      </button>
                      <span className="px-5 py-3 font-orbitron text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity((value) => value + 1)}
                        className="px-4 py-3 text-lg transition-colors hover:bg-gundam-cyan/10"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-gundam-text-muted">
                      {t('product.detail.responsiveHint')}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <AddToCartButton
                      productId={product._id}
                      quantity={quantity}
                      className="flex-1 justify-center py-4 text-sm tracking-[0.22em] shadow-cyan-glow"
                    />
                    <WishlistButton
                      productId={product._id}
                      className="justify-center rounded-2xl border border-gundam-border/30 bg-white/5 p-4 hover:border-gundam-cyan"
                      iconClassName="h-5 w-5"
                    />
                  </div>
                </div>

                {product.marketIntel && (
                  <div className="mt-6 rounded-[1.6rem] border border-gundam-amber/25 bg-gundam-amber/5 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-amber">{t('product.detail.rareItem')}</p>
                        <p className="mt-2 text-2xl font-orbitron font-black text-white">
                          ${product.marketIntel.estimatedValue.toLocaleString()}
                        </p>
                        <p className="mt-2 text-sm text-gundam-text-secondary">
                          {t('product.detail.estimatedBand', {
                            min: `$${product.marketIntel.valueBand.min.toLocaleString()}`,
                            max: `$${product.marketIntel.valueBand.max.toLocaleString()}`,
                          })}
                        </p>
                      </div>
                      <span className="rounded-full border border-gundam-amber/30 px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-amber">
                        {t('product.detail.confidence', { value: product.marketIntel.confidence })}
                      </span>
                    </div>

                    {!!product.marketIntel.signals?.length && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.marketIntel.signals.map((signal) => (
                          <span
                            key={signal}
                            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-text-secondary"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!!product.tags?.length && (
                  <div className="mt-6">
                    <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">{t('product.detail.catalogTags')}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-gundam-cyan/20 bg-gundam-cyan/10 px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 border-t border-gundam-border/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gundam-border/40 bg-gundam-bg-tertiary">
                      <User size={20} className="text-gundam-text-muted" />
                    </div>
                    <div>
                      <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-muted">{t('product.detail.authorizedSeller')}</p>
                      <p className="text-sm font-orbitron font-bold uppercase tracking-tight text-white">
                        {product.seller?.displayName || t('common.unknownPilot')}
                      </p>
                    </div>
                  </div>

                  {product.seller?._id ? (
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <StartConversationButton
                        recipientId={product.seller._id}
                        context={{ productId: product._id }}
                        variant="ghost"
                        className="w-full sm:w-auto"
                      />
                      <Link
                        to={`/seller/${product.seller._id}`}
                        className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-cyan hover:underline"
                      >
                        {t('product.detail.sellerProfile')}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.9rem] border border-gundam-border/25 bg-black/15 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles size={18} className="text-gundam-cyan" />
              <h2 className="text-xl font-orbitron font-black uppercase tracking-tight text-white">{t('product.detail.pilotNotes')}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SignalCard label={t('product.detail.scale')} value={product.specs?.scale || 'N/A'} />
              <SignalCard label={t('product.detail.rarityTier')} value={tv('rarity', product.rarity)} />
              <SignalCard label={t('product.detail.category')} value={product.category?.name || 'Unknown'} />
              <SignalCard label={t('product.detail.responseProfile')} value={tv('grade', product.grade)} />
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-gundam-border/25 bg-black/15 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <FooterIcon icon={<ShieldCheck className="text-gundam-cyan" />} title={t('product.detail.authenticUnit')} text={t('product.detail.authenticDesc')} />
              <FooterIcon icon={<Truck className="text-gundam-amber" />} title={t('product.detail.shipping')} text={t('product.detail.shippingDesc')} />
              <FooterIcon icon={<RotateCcw className="text-gundam-red" />} title={t('product.detail.refund')} text={t('product.detail.refundDesc')} />
            </div>
          </div>
        </section>

        <ReviewSection productId={product._id} />

        {recommendations.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-[0.3em] text-gundam-cyan">{t('product.detail.relatedBadge')}</p>
                <h2 className="mt-2 text-2xl font-orbitron font-black uppercase tracking-tight text-white">
                  {t('product.detail.relatedTitle')}
                </h2>
              </div>
              <p className="max-w-xl text-sm text-gundam-text-secondary">
                {t('product.detail.relatedDescription')}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-4">
              {recommendations.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

const DetailBadge = ({ value, tone = 'neutral' }) => {
  const toneClassName = {
    cyan: 'border-gundam-cyan/30 bg-gundam-cyan/10 text-gundam-cyan',
    amber: 'border-gundam-amber/30 bg-gundam-amber/10 text-gundam-amber',
    neutral: 'border-white/10 bg-black/35 text-gundam-text-secondary',
  }[tone]

  return (
    <span className={cn('rounded-full border px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.22em]', toneClassName)}>
      {value}
    </span>
  )
}

const SignalCard = ({ label, value, compact = false }) => (
  <div className={cn('rounded-2xl border border-gundam-border/20 bg-black/20 p-4', compact && 'h-full')}>
    <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-muted">{label}</p>
    <p className="mt-2 text-sm font-orbitron font-bold uppercase tracking-tight text-white">{value}</p>
  </div>
)

const FooterIcon = ({ icon, title, text }) => (
  <div className="flex items-start gap-4 rounded-2xl border border-gundam-border/20 bg-black/20 p-4">
    <div className="rounded-xl border border-gundam-border/30 bg-gundam-bg-tertiary p-3">{icon}</div>
    <div>
      <h4 className="text-xs font-orbitron font-bold uppercase tracking-[0.2em] text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-gundam-text-secondary">{text}</p>
    </div>
  </div>
)

export default ProductDetailPage
