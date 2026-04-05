import { motion } from 'framer-motion'
import { ChevronRight, LayoutGrid, Repeat, Rocket, Shield, Users, Zap, ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import categoryService from '../../services/categoryService'
import productService from '../../services/productService'
import tradeService from '../../services/tradeService'
import CategoryList from '../../components/product/CategoryList'
import SeoHead from '../../components/shared/SeoHead'
import { useI18n } from '../../i18n/I18nProvider'

const HomePage = () => {
  const { t, locale } = useI18n()
  const [systemSnapshot, setSystemSnapshot] = useState({
    catalogCount: null,
    tradeCount: null,
    categoryCount: null,
    syncedAt: null,
    isLoading: true,
  })

  useEffect(() => {
    let active = true

    const loadSystemSnapshot = async () => {
      const [productsResult, tradesResult, categoriesResult] = await Promise.allSettled([
        productService.getProducts({ page: 1, limit: 1 }),
        tradeService.getListings({ page: 1, limit: 1, status: 'open' }),
        categoryService.getCategories(),
      ])

      if (!active) return

      setSystemSnapshot({
        catalogCount: productsResult.status === 'fulfilled' ? productsResult.value?.totalResults ?? 0 : null,
        tradeCount: tradesResult.status === 'fulfilled' ? tradesResult.value?.totalResults ?? 0 : null,
        categoryCount: categoriesResult.status === 'fulfilled' ? categoriesResult.value?.length ?? 0 : null,
        syncedAt: new Date().toISOString(),
        isLoading: false,
      })
    }

    loadSystemSnapshot()

    return () => {
      active = false
    }
  }, [])

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US'),
    [locale]
  )

  const readinessCopy = locale === 'vi'
    ? {
      badge: 'Bảng trạng thái triển khai',
      title: 'Hệ thống đã sẵn sàng cho',
      highlight: 'catalog, giao dịch và vận hành thực tế',
      description:
        'Thay vì KPI giả, khu vực này hiển thị những tín hiệu đang lấy từ dữ liệu public của hệ thống và những năng lực đã được nối thật trong MVP.',
      metrics: [
        {
          label: 'Kit đang đồng bộ',
          description: 'Lấy từ catalog public đang mở bán trong hệ thống.',
          value: systemSnapshot.catalogCount,
        },
        {
          label: 'Tin trao đổi đang mở',
          description: 'Số listing đang ở trạng thái có thể thương lượng.',
          value: systemSnapshot.tradeCount,
        },
        {
          label: 'Nhóm danh mục hoạt động',
          description: 'Những sector đang hiển thị cho người dùng public.',
          value: systemSnapshot.categoryCount,
        },
      ],
      liveTitle: 'Tín hiệu vận hành hiện có',
      liveState: 'Đang trực tuyến',
      capabilities: [
        {
          title: 'Auth và phiên đăng nhập',
          description: 'JWT, refresh rotation và ghi nhớ phiên đã được nối vào app.',
          icon: Shield,
        },
        {
          title: 'Sàn trao đổi và chat',
          description: 'Offer, trạng thái giao dịch và console realtime đang hoạt động.',
          icon: Repeat,
        },
        {
          title: 'Catalog responsive',
          description: 'Giao diện shop và chi tiết sản phẩm đã tối ưu cho mobile lẫn split-screen.',
          icon: LayoutGrid,
        },
      ],
      syncLabel: 'Đồng bộ lúc',
      syncPending: 'Đang lấy snapshot từ hệ thống...',
      primaryAction: 'Vào kho sản phẩm',
      secondaryAction: 'Tạo tài khoản',
    }
    : {
      badge: 'Deployment readiness panel',
      title: 'The platform is ready for',
      highlight: 'catalog, trading, and real operational flows',
      description:
        'Instead of fake KPIs, this zone reflects public system data and the core capabilities that are already wired into the MVP.',
      metrics: [
        {
          label: 'Catalog units synced',
          description: 'Pulled from the active public storefront catalog.',
          value: systemSnapshot.catalogCount,
        },
        {
          label: 'Open trade signals',
          description: 'Listings currently available for negotiation.',
          value: systemSnapshot.tradeCount,
        },
        {
          label: 'Active catalog sectors',
          description: 'Public-facing category groups currently online.',
          value: systemSnapshot.categoryCount,
        },
      ],
      liveTitle: 'Live operational signals',
      liveState: 'Online now',
      capabilities: [
        {
          title: 'Auth and session memory',
          description: 'JWT, refresh rotation, and remembered sessions are already connected.',
          icon: Shield,
        },
        {
          title: 'Trade and chat layer',
          description: 'Offers, trade states, and the realtime console are functioning.',
          icon: Repeat,
        },
        {
          title: 'Responsive catalog surface',
          description: 'Shop and product detail views are tuned for mobile and split-screen use.',
          icon: LayoutGrid,
        },
      ],
      syncLabel: 'Last sync',
      syncPending: 'Pulling the latest public snapshot...',
      primaryAction: 'Open catalog',
      secondaryAction: 'Create account',
    }

  const formatMetric = (value) => {
    if (typeof value !== 'number') {
      return '—'
    }

    return formatter.format(value)
  }

  const syncedLabel = systemSnapshot.syncedAt
    ? new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(systemSnapshot.syncedAt))
    : readinessCopy.syncPending

  return (
    <div className="pt-16">
      <SeoHead
        locale={locale}
        path="/"
        title={locale === 'vi' ? 'Trang chủ mua bán và trao đổi Gundam' : 'Gundam store and trade hub homepage'}
        description={
          locale === 'vi'
            ? 'Khám phá Gundam Universe, website mua bán và sàn trao đổi Gundam với catalog responsive, chat realtime, wishlist và dashboard seller/admin chuẩn triển khai.'
            : 'Explore Gundam Universe, a Gundam marketplace and trade hub with responsive catalog views, realtime chat, wishlists, and deploy-ready seller/admin tools.'
        }
        keywords={
          locale === 'vi'
            ? 'Gundam Universe, mua bán Gundam, sàn trao đổi Gundam, Gunpla Việt Nam, website Gundam'
            : 'Gundam Universe, Gundam marketplace, Gunpla trade hub, mecha ecommerce, Gundam store'
        }
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Gundam Universe',
          url: 'https://gundam-universe-store.vercel.app',
          inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://gundam-universe-store.vercel.app/shop?name={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <section className="relative flex h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gundam-bg-primary">
          <motion.div
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gundam-cyan/10 blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-gundam-red/5 blur-[120px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gundam-cyan/50" />
              <span className="font-rajdhani text-sm font-bold uppercase tracking-[0.3em] text-gundam-cyan sm:text-base">
                {t('home.welcome')}
              </span>
              <span className="h-px w-12 bg-gundam-cyan/50" />
            </div>

            <h1 className="mb-8 text-5xl font-black leading-tight md:text-8xl">
              {t('home.headline.collect')} <span className="glow-text text-gundam-cyan">{t('home.headline.trade')}</span> <br />
              {t('home.headline.destiny')}
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gundam-text-secondary md:text-xl font-rajdhani">
              {t('home.description')}
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link to="/shop" className="btn btn-primary flex w-full items-center justify-center gap-2 px-10 py-4 text-lg sm:w-auto">
                {t('home.ctaShop')} <Rocket size={20} />
              </Link>
              <Link to="/trade" className="btn btn-outline flex w-full items-center justify-center gap-2 px-10 py-4 text-lg sm:w-auto">
                {t('home.ctaTrade')} <Repeat size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] font-orbitron uppercase tracking-widest">{t('home.scroll')}</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-gundam-cyan to-transparent" />
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-gundam-bg-primary py-20">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-orbitron text-3xl font-black text-gundam-text-primary">
                {t('home.sectorTitle').split(' ')[0]} <span className="glow-text text-gundam-cyan">{t('home.sectorTitle').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="mt-2 text-xs font-rajdhani uppercase tracking-widest text-gundam-text-muted">{t('home.sectorSubtitle')}</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-[10px] font-orbitron tracking-widest text-gundam-cyan hover:glow-text">
              {t('common.viewAll').toUpperCase()} <LayoutGrid size={14} className="transition-transform group-hover:rotate-90" />
            </Link>
          </div>
          <CategoryList />
        </div>
      </section>

      <section className="relative bg-gundam-bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Shield className="text-gundam-cyan" size={32} />}
              title={t('home.featureTitles.quality')}
              description={t('home.featureDescriptions.quality')}
              cta={t('common.learnMore')}
            />
            <FeatureCard
              icon={<Repeat className="text-gundam-amber" size={32} />}
              title={t('home.featureTitles.trading')}
              description={t('home.featureDescriptions.trading')}
              cta={t('common.learnMore')}
            />
            <FeatureCard
              icon={<Users className="text-gundam-emerald" size={32} />}
              title={t('home.featureTitles.community')}
              description={t('home.featureDescriptions.community')}
              cta={t('common.learnMore')}
            />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="group glass-card relative overflow-hidden rounded-[2rem] border border-gundam-border/30 p-8 md:p-12">
            <div className="hud-line absolute left-0 top-0 w-full opacity-50" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gundam-cyan/10 blur-3xl transition-colors group-hover:bg-gundam-cyan/15" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] lg:items-start">
              <div>
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-gundam-cyan/20 bg-gundam-cyan/10 px-4 py-2 text-[11px] font-orbitron uppercase tracking-[0.28em] text-gundam-cyan">
                  <span className="h-2 w-2 rounded-full bg-gundam-emerald shadow-[0_0_12px_rgba(29,185,84,0.75)]" />
                  {readinessCopy.badge}
                </div>
                <h2 className="max-w-4xl text-3xl font-black leading-tight text-gundam-text-primary md:text-5xl">
                  {readinessCopy.title}{' '}
                  <span className="glow-text text-gundam-cyan">{readinessCopy.highlight}</span>
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-gundam-text-secondary md:text-lg">
                  {readinessCopy.description}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {readinessCopy.metrics.map((metric) => (
                    <StatusItem
                      key={metric.label}
                      label={metric.label}
                      description={metric.description}
                      value={systemSnapshot.isLoading ? '...' : formatMetric(metric.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-gundam-border/40 bg-gundam-bg-tertiary/80 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.06)]">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">
                        {readinessCopy.liveTitle}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gundam-text-primary">
                        {readinessCopy.liveState}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-gundam-emerald/30 bg-gundam-emerald/10 px-3 py-1 text-[11px] font-orbitron uppercase tracking-[0.2em] text-gundam-emerald">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gundam-emerald opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gundam-emerald" />
                      </span>
                      Live
                    </div>
                  </div>

                  <div className="space-y-3">
                    {readinessCopy.capabilities.map(({ title, description, icon: Icon }) => (
                      <div
                        key={title}
                        className="flex gap-4 rounded-2xl border border-gundam-border/30 bg-gundam-bg-primary/70 px-4 py-4"
                      >
                        <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gundam-cyan/20 bg-gundam-cyan/10 text-gundam-cyan">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gundam-text-primary">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-gundam-text-secondary">
                            {description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-gundam-border/20 pt-4 text-sm text-gundam-text-muted">
                    <span>{readinessCopy.syncLabel}</span>
                    <span className="font-medium text-gundam-text-secondary">{syncedLabel}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/shop"
                    className="btn btn-primary flex flex-1 items-center justify-center gap-2 px-6 py-4"
                  >
                    {readinessCopy.primaryAction} <ArrowUpRight size={18} />
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline flex flex-1 items-center justify-center gap-2 px-6 py-4"
                  >
                    {readinessCopy.secondaryAction} <Zap size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, description, cta }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="glass-card group flex flex-col gap-6 border-gundam-border p-8 transition-all duration-500 hover:border-gundam-cyan/50"
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gundam-border/50 bg-gundam-bg-tertiary transition-all group-hover:border-gundam-cyan/50 group-hover:shadow-cyan-glow">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="font-rajdhani leading-relaxed text-gundam-text-secondary">{description}</p>
    <Link to="/shop" className="group/link mt-auto flex items-center gap-1 font-orbitron text-xs tracking-widest text-gundam-cyan">
      {cta.toUpperCase()} <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-1" />
    </Link>
  </motion.div>
)

const StatusItem = ({ label, description, value }) => (
  <div className="rounded-[1.5rem] border border-gundam-border/30 bg-gundam-bg-secondary/50 p-5">
    <span className="text-[11px] uppercase tracking-[0.24em] text-gundam-text-muted">{label}</span>
    <span className="mt-3 block text-3xl font-black tracking-tight text-gundam-text-primary">{value}</span>
    <p className="mt-2 text-sm leading-relaxed text-gundam-text-secondary">{description}</p>
  </div>
)

export default HomePage
