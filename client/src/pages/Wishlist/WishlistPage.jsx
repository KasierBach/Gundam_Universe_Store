import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import useWishlistStore from '../../stores/wishlistStore'
import AddToCartButton from '../../components/cart/AddToCartButton'
import ModelKitImage from '../../components/shared/ModelKitImage'
import { useI18n } from '../../i18n/I18nProvider'
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy'

const WishlistPage = () => {
  const { locale } = useI18n()
  const { products, loading, fetchWishlist, clearWishlist, removeFromWishlist } = useWishlistStore()
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      title: 'Bộ sưu tập yêu thích',
      subtitle: 'Các mẫu Gundam bạn đã lưu để quay lại sau',
      clear: 'Xóa toàn bộ yêu thích',
      loading: 'Đang quét kho yêu thích...',
      emptyTitle: 'Chưa có sản phẩm yêu thích',
      emptyDescription: 'Lưu các kit bạn thích tại đây để quay lại khi sẵn sàng xuống tiền.',
      browse: 'Khám phá sản phẩm',
    }
    : {
      title: 'Favorite Collection',
      subtitle: 'Curated mobile suits marked for future deployment',
      clear: 'Clear favorites',
      loading: 'Scanning favorite archive...',
      emptyTitle: 'No favorites locked in',
      emptyDescription: 'Save premium kits here so you can return to them when your next budget window opens.',
      browse: 'Browse units',
    })

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gundam-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gundam-border/20 pb-8">
          <div>
            <h1 className="text-4xl font-orbitron text-white uppercase tracking-tight">{copy.title}</h1>
            <p className="mt-2 text-gundam-text-muted font-rajdhani uppercase tracking-[0.35em] text-xs">
              {copy.subtitle}
            </p>
          </div>
          {products.length > 0 ? (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-gundam-red font-orbitron text-xs uppercase tracking-widest hover:text-white"
            >
              {copy.clear}
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="pt-20 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-[0.3em]">{copy.loading}</div>
        ) : products.length === 0 ? (
          <div className="glass-card border-dashed border-gundam-cyan/20 p-16 text-center">
            <Heart size={52} className="mx-auto text-gundam-cyan/40 mb-6" />
            <h2 className="text-2xl font-orbitron text-white uppercase tracking-tight">{copy.emptyTitle}</h2>
            <p className="mt-3 text-gundam-text-secondary font-rajdhani">{copy.emptyDescription}</p>
            <Link to="/shop" className="inline-block mt-8 btn btn-primary px-8 py-3">{copy.browse}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="glass-card border-gundam-border/30 p-5 flex flex-col">
                <div className="aspect-square rounded-xl bg-gundam-bg-tertiary border border-gundam-border/20 overflow-hidden flex items-center justify-center p-4">
                  <ModelKitImage
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    name={product.name}
                    grade={product.grade}
                    series={product.series}
                  />
                </div>
                <div className="mt-5 flex-1">
                  <Link to={`/products/${product.slug}`} className="text-white font-orbitron text-lg uppercase tracking-tight hover:text-gundam-cyan">
                    {product.name}
                  </Link>
                  <p className="mt-2 text-gundam-text-muted text-xs uppercase tracking-widest">
                    {product.grade} | {product.series} | {product.rarity}
                  </p>
                  <p className="mt-4 text-2xl font-orbitron text-gundam-cyan">${product.price.toLocaleString()}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <AddToCartButton productId={product._id} className="flex-1 py-3" />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product._id)}
                    className="w-12 rounded-lg border border-gundam-red/40 text-gundam-red hover:bg-gundam-red/10"
                  >
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
