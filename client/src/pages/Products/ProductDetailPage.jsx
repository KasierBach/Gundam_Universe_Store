import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Truck, RotateCcw, ChevronRight, Loader2, PackageX, User } from 'lucide-react'
import productService from '../../services/productService'
import AddToCartButton from '../../components/cart/AddToCartButton'
import ProductCard from '../../components/product/ProductCard'
import ReviewSection from '../../components/product/ReviewSection'
import WishlistButton from '../../components/wishlist/WishlistButton'
import { cn } from '../../utils/cn'

const ProductDetailPage = () => {
  const { slug } = useParams()
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gundam-bg-primary gap-4">
        <Loader2 className="animate-spin text-gundam-cyan" size={64} />
        <span className="font-orbitron text-xs tracking-[0.5em] text-gundam-cyan opacity-50">INITIALIZING UNIT DATALINK...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center bg-gundam-bg-primary text-center">
        <PackageX size={80} className="text-gundam-red opacity-30 mb-6" />
        <h1 className="text-3xl font-black font-orbitron text-gundam-text-primary mb-4">UNIT NOT FOUND</h1>
        <p className="text-gundam-text-secondary font-rajdhani mb-8">The requested Mobile Suit data is unavailable in current sector.</p>
        <Link to="/shop" className="btn btn-primary px-8 py-3">RETURN TO SHOP</Link>
      </div>
    )
  }

  const mainImages = product.images || []

  return (
    <div className="pt-24 pb-24 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-orbitron tracking-widest text-gundam-text-muted mb-8 uppercase">
           <Link to="/" className="hover:text-gundam-cyan">UC ERA</Link>
           <ChevronRight size={12} />
           <Link to="/shop" className="hover:text-gundam-cyan">TACTICAL SHOP</Link>
           <ChevronRight size={12} />
           <span className="text-gundam-cyan">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square glass-card bg-gundam-bg-tertiary overflow-hidden border-gundam-border flex items-center justify-center group/main">
               <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    src={mainImages[selectedImage]?.url} 
                    className="w-full h-full object-contain p-8"
                  />
               </AnimatePresence>
               <div className="absolute inset-0 hud-scanline opacity-10" />
               <div className="absolute bottom-4 left-4 font-orbitron text-[8px] tracking-[0.2em] text-gundam-cyan/40">
                  REF: {product._id.slice(-8).toUpperCase()}
               </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {mainImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-lg glass-card p-1 border-2 transition-all overflow-hidden",
                    selectedImage === idx ? "border-gundam-cyan bg-gundam-cyan/10" : "border-gundam-border/30 hover:border-gundam-cyan/50"
                  )}
                >
                  <img src={img.url} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-gundam-cyan text-gundam-bg-primary text-[10px] font-orbitron font-black uppercase rounded shadow-cyan-glow">
                   {product.grade}
                 </span>
                 <span className="px-3 py-1 bg-gundam-bg-secondary border border-gundam-border text-gundam-text-secondary text-[10px] font-orbitron uppercase rounded">
                   {product.rarity}
                 </span>
                 <span className="text-sm font-rajdhani text-gundam-cyan/60 uppercase tracking-widest">{product.series}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black font-orbitron text-gundam-text-primary leading-tight mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-gundam-text-secondary font-rajdhani text-sm mb-6">
                 <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-gundam-emerald"/> Genuine Bandai Product</span>
                 <span className="text-gundam-border">|</span>
                 <span>VIEWS: {product.views.toLocaleString()}</span>
              </div>

              <div className="text-4xl font-black font-orbitron text-gundam-cyan glow-text mb-8">
                 ${product.price.toLocaleString()}
              </div>

              <p className="text-gundam-text-secondary font-rajdhani text-lg leading-relaxed mb-8 border-l-2 border-gundam-border/30 pl-6">
                {product.description}
              </p>
            </div>

            {/* Action Box */}
            <div className="glass-card p-8 border-gundam-border/50 bg-gundam-bg-tertiary mb-10">
               <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center border border-gundam-border rounded-lg overflow-hidden bg-gundam-bg-primary">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gundam-cyan/10 transition-colors"
                    >-</button>
                    <span className="px-4 font-orbitron text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gundam-cyan/10 transition-colors"
                    >+</button>
                  </div>
                  <span className="text-xs font-rajdhani text-gundam-text-muted uppercase tracking-widest">
                    Available Units: {product.stock}
                  </span>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <AddToCartButton 
                    productId={product._id} 
                    quantity={quantity}
                    className="flex-grow py-4 text-lg shadow-cyan-glow" 
                  />
                  <WishlistButton productId={product._id} className="btn bg-gundam-bg-secondary border border-gundam-border flex items-center justify-center p-4 hover:border-gundam-cyan transition-all" iconClassName="w-6 h-6" />
               </div>
            </div>

            {/* Mecha Specs Section */}
            <div className="mt-auto">
               <h3 className="font-orbitron font-bold text-sm tracking-widest mb-6 uppercase flex items-center gap-2">
                 <div className="w-2 h-2 bg-gundam-cyan animate-pulse" /> TECHNICAL SPECS
               </h3>
               <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <SpecItem label="Scale" value={product.specs.scale || 'N/A'} />
                  <SpecItem label="Material" value={product.specs.material || 'N/A'} />
                  <SpecItem label="Box Dimensions" value={product.specs.dimensions || 'N/A'} />
                  <SpecItem label="Weight" value={product.specs.weight || 'N/A'} />
                  <SpecItem label="Condition" value={product.condition} />
                  <SpecItem label="Pilot System" value="UC ERA COMPLIANT" />
               </div>
            </div>

            {/* Seller Info Placeholder */}
            <div className="mt-12 pt-8 border-t border-gundam-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gundam-bg-tertiary flex items-center justify-center border border-gundam-border/50">
                      <User size={20} className="text-gundam-text-muted" />
                   </div>
                   <div>
                      <div className="text-[10px] font-orbitron text-gundam-text-muted uppercase">Authorized Seller</div>
                      <div className="text-sm font-bold text-gundam-text-primary uppercase tracking-tighter">{product.seller?.displayName || 'Unknown Pilot'}</div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <Link to={`/seller/${product.seller?._id}`} className="text-[10px] font-orbitron text-gundam-cyan hover:underline uppercase tracking-widest">View Profile</Link>
                </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product._id} />

        {recommendations.length > 0 && (
          <section className="mt-20">
            <div className="mb-8">
              <h2 className="text-2xl font-orbitron text-white uppercase tracking-tight">Related Units</h2>
              <p className="mt-2 text-gundam-text-muted font-rajdhani uppercase tracking-[0.3em] text-xs">
                Recommended based on unit category and combat profile
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
              {recommendations.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* Tactical Footer Icons */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gundam-border/20">
           <FooterIcon icon={<ShieldCheck className="text-gundam-cyan" />} title="AUTHENTIC UNIT" text="Verified by tactical pilot committee" />
           <FooterIcon icon={<Truck className="text-gundam-amber" />} title="SPACE DEPLOYMENT" text="Fast delivery across the solar system" />
           <FooterIcon icon={<RotateCcw className="text-gundam-red" />} title="REFUND PROTOCOL" text="30-day return policy for unopened kits" />
        </div>
      </div>
    </div>
  )
}

const SpecItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gundam-border/10">
    <span className="text-[10px] font-orbitron text-gundam-text-muted uppercase tracking-widest">{label}</span>
    <span className="text-xs font-rajdhani font-bold text-gundam-text-primary">{value}</span>
  </div>
)

const FooterIcon = ({ icon, title, text }) => (
  <div className="flex items-start gap-4">
     <div className="p-3 bg-gundam-bg-tertiary rounded-lg border border-gundam-border/50">{icon}</div>
     <div>
        <h4 className="font-orbitron font-bold text-xs tracking-widest mb-1">{title}</h4>
        <p className="text-xs font-rajdhani text-gundam-text-secondary">{text}</p>
     </div>
  </div>
)

export default ProductDetailPage
