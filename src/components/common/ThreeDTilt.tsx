import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface ThreeDTiltProps {
  children: React.ReactNode
  className?: string
  intensity?: number // multiplier for tilt effect, default 15
}

export function ThreeDTilt({ children, className = '', intensity = 12 }: ThreeDTiltProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  // Mouse position relative to center of the card (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs to avoid jitter
  const springSettings = { damping: 25, stiffness: 200, mass: 0.5 }
  const rotateXSpring = useSpring(y, springSettings)
  const rotateYSpring = useSpring(x, springSettings)

  // Map mouse positions to rotational angles
  // Moving mouse up (negative Y offset) tilts card backwards (positive rotateX)
  // Moving mouse right (positive X offset) tilts card right (positive rotateY)
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-intensity, intensity])

  // Glare / Shine position tracking
  const glareX = useTransform(rotateYSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(rotateXSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareOpacity = useMotionValue(0)
  const glareOpacitySpring = useSpring(glareOpacity, springSettings)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Calculate relative cursor position from center of card
    const relativeX = (e.clientX - rect.left) / width - 0.5
    const relativeY = (e.clientY - rect.top) / height - 0.5

    x.set(relativeX)
    y.set(relativeY)
    glareOpacity.set(0.15) // Show subtle reflection glow
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    glareOpacity.set(0) // Hide glare on leave
  }

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative h-full w-full select-none overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#101010] transition-colors duration-500 hover:border-white/10 ${className}`}
      >
        {/* Shine/Glare overlay */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            pointerEvents: 'none',
            background: `radial-gradient(circle 200px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.12), transparent)`,
            opacity: glareOpacitySpring,
          }}
        />

        {/* Content container with preserve-3d to allow nested element pop-outs */}
        <div style={{ transformStyle: 'preserve-3d' }} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

