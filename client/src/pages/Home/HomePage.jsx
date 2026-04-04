import { motion } from 'framer-motion'
import { ChevronRight, LayoutGrid, Repeat, Rocket, Shield, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import CategoryList from '../../components/product/CategoryList'
import { useI18n } from '../../i18n/I18nProvider'

const HomePage = () => {
  const { t } = useI18n()

  return (
    <div className="pt-16">
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
        <div className="group glass-card relative mx-auto overflow-hidden rounded-2xl border border-gundam-border/30 p-8 md:p-12 container">
          <div className="hud-line absolute left-0 top-0 w-full opacity-50" />
          <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                {t('home.status.title')}: <span className="text-gundam-emerald">{t('home.status.online')}</span>
              </h2>
              <div className="grid grid-cols-2 gap-8 font-rajdhani">
                <StatusItem label={t('home.status.activePilots')} value="12,842" />
                <StatusItem label={t('home.status.modelsTraded')} value="54,204" />
                <StatusItem label={t('home.status.marketIndex')} value="+4.2%" />
                <StatusItem label={t('home.status.uptime')} value="99.9%" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link to="/register" className="group btn-primary flex aspect-square w-48 flex-col items-center justify-center gap-2 rounded-full px-8 py-8 shadow-cyan-glow transition-transform hover:scale-105">
                <Zap size={32} className="fill-current" />
                <span className="font-orbitron text-sm font-bold tracking-tighter">{t('home.status.enlist')}</span>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-gundam-cyan/5 blur-3xl transition-colors group-hover:bg-gundam-cyan/10" />
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

const StatusItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-widest text-gundam-text-muted">{label}</span>
    <span className="text-2xl font-bold tracking-tight text-gundam-text-primary">{value}</span>
  </div>
)

export default HomePage
