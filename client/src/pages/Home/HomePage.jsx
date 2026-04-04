import { motion } from 'framer-motion'
import { Rocket, Shield, Repeat, Users, ChevronRight, Zap, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import CategoryList from '../../components/product/CategoryList'

const HomePage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gundam-bg-primary">
          {/* Animated Background Elements */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gundam-cyan/10 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gundam-red/5 rounded-full blur-[120px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-12 bg-gundam-cyan/50" />
              <span className="font-rajdhani font-bold tracking-[0.3em] text-gundam-cyan uppercase text-sm sm:text-base">
                Welcome to the UC Era 0096
              </span>
              <span className="h-px w-12 bg-gundam-cyan/50" />
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
              COLLECT. <span className="text-gundam-cyan glow-text">TRADE.</span> <br />
              DESTINY.
            </h1>

            <p className="max-w-2xl mx-auto text-gundam-text-secondary text-lg md:text-xl font-rajdhani leading-relaxed mb-10">
              The ultimate high-performance tactical platform for Gundam enthusiasts. 
              Buy exclusive models and trade with pilots across the universe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="btn btn-primary px-10 py-4 text-lg w-full sm:w-auto flex items-center justify-center gap-2">
                Launch Shop <Rocket size={20} />
              </Link>
              <Link to="/trade" className="btn btn-outline px-10 py-4 text-lg w-full sm:w-auto flex items-center justify-center gap-2">
                Enter Trading Deck <Repeat size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] font-orbitron tracking-widest uppercase">Scroll to Pilot</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gundam-cyan to-transparent" />
        </motion.div>
      </section>

      {/* Category Section */}
      <section className="py-20 bg-gundam-bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black font-orbitron text-gundam-text-primary">
                SELECT <span className="text-gundam-cyan glow-text">SECTOR</span>
              </h2>
              <p className="text-gundam-text-muted font-rajdhani text-xs tracking-widest uppercase mt-2">Filter by Gundam category</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-[10px] font-orbitron tracking-widest text-gundam-cyan hover:glow-text">
              VIEW ALL <LayoutGrid size={14} className="group-hover:rotate-90 transition-transform" />
            </Link>
          </div>
          <CategoryList />
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-gundam-bg-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="text-gundam-cyan" size={32} />}
              title="Verified Quality"
              description="Every model in our store is 100% authentic Bandai Spirits, verified by our tactical inspection team."
            />
            <FeatureCard 
              icon={<Repeat className="text-gundam-amber" size={32} />}
              title="Realtime Trading"
              description="Direct P2P trading with secure communication channels. Finalize your deals in the Mission Console."
            />
            <FeatureCard 
              icon={<Users className="text-gundam-emerald" size={32} />}
              title="Pilot Community"
              description="Connect with veteran modelers, share your build logs, and grow your pilot reputation score."
            />
          </div>
        </div>
      </section>

      {/* Status HUD Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 border border-gundam-border/30 rounded-2xl p-8 md:p-12 glass-card relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full hud-line opacity-50" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">SYSTEM STATUS: <span className="text-gundam-emerald">ONLINE</span></h2>
              <div className="grid grid-cols-2 gap-8 font-rajdhani">
                <StatusItem label="ACTIVE PILOTS" value="12,842" />
                <StatusItem label="MODELS TRADED" value="54,204" />
                <StatusItem label="UC MARKET INDEX" value="+4.2%" />
                <StatusItem label="SYSTEM UPTIME" value="99.9%" />
              </div>
            </div>
            <div className="flex-shrink-0">
               <Link to="/register" className="btn-primary group px-8 py-8 rounded-full flex flex-col items-center justify-center gap-2 aspect-square w-48 shadow-cyan-glow hover:scale-105 transition-transform">
                  <Zap size={32} className="fill-current" />
                  <span className="font-orbitron font-bold text-sm tracking-tighter">ENLIST NOW</span>
               </Link>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gundam-cyan/5 rounded-full blur-3xl -z-10 group-hover:bg-gundam-cyan/10 transition-colors" />
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 glass-card border-gundam-border flex flex-col gap-6 group hover:border-gundam-cyan/50 transition-all duration-500"
  >
    <div className="w-16 h-16 rounded-xl bg-gundam-bg-tertiary flex items-center justify-center border border-gundam-border/50 group-hover:border-gundam-cyan/50 group-hover:shadow-cyan-glow transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gundam-text-secondary leading-relaxed font-rajdhani">{description}</p>
    <Link to="/shop" className="text-gundam-cyan font-orbitron text-xs tracking-widest flex items-center gap-1 group/link mt-auto">
      LEARN MORE <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
)

const StatusItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-gundam-text-muted text-xs tracking-widest uppercase">{label}</span>
    <span className="text-2xl font-bold tracking-tight text-gundam-text-primary">{value}</span>
  </div>
)

export default HomePage
