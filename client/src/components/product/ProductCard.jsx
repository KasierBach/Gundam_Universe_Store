import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import AddToCartButton from '../cart/AddToCartButton'
import WishlistButton from '../wishlist/WishlistButton'
import { cn } from '../../utils/cn'

const ProductCard = ({ product }) => {
  const { name, slug, price, images, category, grade, series, rarity, condition } = product
  const mainImage = images.find(img => img.isMain)?.url || images[0]?.url

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col glass-card border-gundam-border overflow-hidden group/card"
    >
      {/* Rarity & Condition Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-orbitron font-bold tracking-widest uppercase shadow-sm",
          rarity === 'Legendary' ? "bg-red-500 text-white animate-pulse" : 
          rarity === 'Super Rare' ? "bg-amber-500 text-white" : "bg-gundam-cyan text-gundam-bg-primary"
        )}>
          {rarity}
        </span>
        <span className="px-2 py-0.5 rounded bg-gundam-bg-primary/80 text-gundam-text-secondary text-[8px] font-orbitron border border-gundam-border">
          {condition}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gundam-bg-tertiary">
        <Link to={`/products/${slug}`} className="block w-full h-full">
          <img 
            src={mainImage} 
            alt={name} 
            className="w-full h-full object-contain p-4 group-hover/card:scale-110 transition-transform duration-500"
          />
        </Link>
        <div className="absolute inset-0 bg-gundam-bg-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
           <AddToCartButton productId={product._id} className="w-12 h-12 !p-0 rounded-full" />
           <WishlistButton productId={product._id} className="w-10 h-10 rounded-full" />
           <Link 
             to={`/products/${slug}`}
             className="w-10 h-10 rounded-full bg-gundam-bg-secondary text-gundam-cyan border border-gundam-cyan flex items-center justify-center hover:scale-110 transition-transform"
           >
             <Eye size={18} />
           </Link>
        </div>
        {/* HUD Scanline Effect on hover */}
        <div className="hud-scanline opacity-0 group-hover/card:opacity-20" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow gap-2">
        <div className="flex justify-between items-start gap-2">
           <span className="text-[10px] font-orbitron text-gundam-cyan tracking-widest opacity-80">{grade}</span>
           <span className="text-[10px] font-rajdhani text-gundam-text-muted">{series}</span>
        </div>
        
        <Link to={`/products/${slug}`}>
          <h3 className="text-sm font-orbitron font-bold text-gundam-text-primary line-clamp-1 group-hover/card:text-gundam-cyan transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gundam-border/20">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gundam-text-muted">Power Required</span>
            <span className="text-lg font-orbitron font-black text-gundam-text-primary">
              ${price.toLocaleString()}
            </span>
          </div>
          <AddToCartButton productId={product._id} className="px-3" />
        </div>
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-gundam-cyan/20 rounded-tl-full" />
    </motion.div>
  )
}

export default ProductCard
