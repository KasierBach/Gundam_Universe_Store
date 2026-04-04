import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

const formatCode = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase() || 'GUN'

const ModelKitImage = ({
  src,
  alt,
  name,
  grade,
  series,
  className,
  imageClassName,
  fallbackClassName,
}) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt || name || 'Gundam model kit'}
        className={cn('w-full h-full object-contain', imageClassName)}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-gundam-bg-tertiary', className, fallbackClassName)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gundam-cyan/60 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gundam-cyan/25 bg-black/25 shadow-cyan-glow">
          <span className="font-orbitron text-lg font-black tracking-[0.2em] text-gundam-cyan">
            {formatCode(name)}
          </span>
        </div>

        <p className="max-w-[16rem] text-sm font-orbitron font-bold uppercase tracking-tight text-white line-clamp-2">
          {name || 'Gundam Unit'}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gundam-text-muted">
          {grade && <span className="rounded border border-gundam-cyan/20 bg-black/30 px-2 py-1 text-gundam-cyan">{grade}</span>}
          {series && <span className="rounded border border-white/10 bg-black/30 px-2 py-1">{series}</span>}
        </div>
      </div>
    </div>
  )
}

export default ModelKitImage
