import React from 'react'
import { motion } from 'framer-motion'

export const HUDOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-20">
      {/* HUD Grid Background */}
      <div className="absolute inset-0 gundam-grid" />
      
      {/* Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gundam-cyan to-transparent shadow-cyan-glow"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Screen Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* HUD Corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gundam-cyan/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gundam-cyan/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gundam-cyan/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gundam-cyan/30" />

      {/* Side HUD Elements */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-8 bg-gundam-cyan/20" />
        ))}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-8 bg-gundam-cyan/20" />
        ))}
      </div>

      {/* Digital Data Noise Lines */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gundam-cyan/40" />
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gundam-cyan/40" />
    </div>
  )
}
