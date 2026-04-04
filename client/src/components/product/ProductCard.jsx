import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eye, Radar, ShieldCheck } from 'lucide-react'
import AddToCartButton from '../cart/AddToCartButton'
import WishlistButton from '../wishlist/WishlistButton'
import { cn } from '../../utils/cn'
import ModelKitImage from '../shared/ModelKitImage'

const rarityStyles = {
  Legendary: 'border-gundam-red/60 bg-gundam-red text-white shadow-[0_0_24px_rgba(239,68,68,0.35)]',
  'Ultra Rare': 'border-gundam-amber/50 bg-gundam-amber text-black shadow-[0_0_18px_rgba(245,158,11,0.28)]',
  'Super Rare': 'border-gundam-cyan/50 bg-gundam-cyan text-gundam-bg-primary shadow-cyan-glow',
}

const ProductCard = ({ product, priority = false }) => {
  const { _id, name, slug, price, images, category, grade, series, rarity, condition, ratings, stock } = product
  const imageList = Array.isArray(images) ? images : []
  const mainImage = imageList.find((img) => img.isMain)?.url || imageList[0]?.url
  const isLowStock = typeof stock === 'number' && stock > 0 && stock <= 4

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-[1.35rem] border border-gundam-border/40 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(5,10,19,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gundam-cyan/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.14),transparent_45%)]" />
        <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-gundam-cyan/10 blur-2xl" />
      </div>

      <div className="relative aspect-[0.9] overflow-hidden border-b border-gundam-border/20 bg-[linear-gradient(180deg,rgba(11,18,32,0.65),rgba(3,7,18,0.92))]">
        <div className="absolute left-4 top-4 z-20 flex max-w-[80%] flex-wrap items-center gap-2">
          <span className={cn(
            'rounded-full border px-3 py-1 text-[10px] font-orbitron uppercase tracking-[0.24em]',
            rarityStyles[rarity] || 'border-gundam-cyan/30 bg-black/45 text-gundam-cyan'
          )}>
            {rarity}
          </span>
          <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-orbitron uppercase tracking-[0.22em] text-gundam-text-secondary">
            {condition}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
          <span className="rounded-full border border-gundam-cyan/20 bg-black/45 px-3 py-1 text-[10px] font-orbitron uppercase tracking-[0.22em] text-gundam-cyan">
            {grade}
          </span>
          <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-rajdhani uppercase tracking-[0.18em] text-gundam-text-muted">
            {category?.name || 'Gundam Unit'}
          </span>
        </div>

        <Link to={`/products/${slug}`} className="block h-full w-full">
          <ModelKitImage
            src={mainImage}
            alt={name}
            name={name}
            grade={grade}
            series={series}
            imageClassName="p-6 transition-transform duration-500 group-hover:scale-[1.08]"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,3,8,0)_35%,rgba(1,3,8,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-0 hud-scanline opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
      </div>

      <div className="relative p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-text-muted">
              {series}
            </p>
            <Link to={`/products/${slug}`}>
              <h3 className="mt-2 line-clamp-2 text-lg font-orbitron font-black uppercase tracking-tight text-white transition-colors group-hover:text-gundam-cyan">
                {name}
              </h3>
            </Link>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gundam-cyan/20 bg-gundam-cyan/10 text-gundam-cyan">
            <Radar size={16} />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl border border-gundam-border/20 bg-black/20 p-3">
          <InfoPill
            label="Rating"
            value={ratings?.count ? `${ratings.average?.toFixed(1)} / 5` : 'No data'}
          />
          <InfoPill
            label="Stock"
            value={stock > 0 ? `${stock} units` : 'Out'}
            accent={isLowStock ? 'warning' : stock > 0 ? 'normal' : 'danger'}
          />
        </div>

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-gundam-text-muted">Power Required</p>
            <p className="mt-2 text-2xl font-orbitron font-black text-white">
              ${price.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WishlistButton productId={_id} className="h-10 w-10 rounded-full border border-gundam-border/40 bg-black/30 p-0" />
            <Link
              to={`/products/${slug}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gundam-cyan/40 bg-gundam-cyan/10 text-gundam-cyan transition-transform hover:scale-105"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AddToCartButton productId={_id} className="flex-1 justify-center px-4 py-3 text-[11px] tracking-[0.22em]" />
          <Link
            to={`/products/${slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gundam-border/40 bg-white/5 px-4 py-3 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-secondary transition-colors hover:border-gundam-cyan/30 hover:text-gundam-cyan"
          >
            <ShieldCheck size={14} /> Full Intel
          </Link>
        </div>
      </div>

      {priority && (
        <div className="absolute right-4 top-4 z-30 rounded-full border border-gundam-amber/30 bg-gundam-amber/15 px-3 py-1 text-[10px] font-orbitron uppercase tracking-[0.28em] text-gundam-amber">
          Command Pick
        </div>
      )}
    </motion.article>
  )
}

const InfoPill = ({ label, value, accent = 'normal' }) => {
  const accentClassName = {
    normal: 'text-gundam-cyan',
    warning: 'text-gundam-amber',
    danger: 'text-gundam-red',
  }[accent]

  return (
    <div>
      <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-text-muted">{label}</p>
      <p className={cn('mt-2 text-sm font-orbitron font-bold uppercase tracking-tight', accentClassName)}>
        {value}
      </p>
    </div>
  )
}

export default ProductCard
