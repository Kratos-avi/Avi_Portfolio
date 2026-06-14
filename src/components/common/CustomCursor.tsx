import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { soundManager } from '../../utils/SoundManager'

export function CustomCursor() {
  const [isSnapped, setIsSnapped] = useState(false)
  const [snapSize, setSnapSize] = useState({ width: 28, height: 28, radius: 9999 })
  const [isVisible] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // Configure high-fidelity spring physics (stiff tracking with smooth drag decay)
  const springConfig = { damping: 25, stiffness: 240, mass: 0.75 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  // Track velocity to apply dynamic stretching (liquid lag trace)
  const lastCoords = useRef({ x: 0, y: 0, time: 0 })
  const [stretchAngle, setStretchAngle] = useState(0)
  const [stretchScale, setStretchScale] = useState(1.0)

  useEffect(() => {
    if (!isVisible) return

    document.body.style.cursor = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveEl = target.closest('a, button, [data-magnetic]') as HTMLElement | null

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        // Snap coordinates directly to center of element
        mouseX.set(cx)
        mouseY.set(cy)

        // Adjust dimensions to fit the snapped element with clean padding
        const isCircle = rect.width === rect.height && rect.width < 50
        setSnapSize({
          width: rect.width + 12,
          height: rect.height + 8,
          radius: isCircle ? 9999 : 8
        })
        setIsSnapped(true)

        // Magnetic pull effect: shift the actual element slightly towards raw mouse coordinates
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        interactiveEl.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`
        interactiveEl.style.transition = 'transform 0.12s ease-out'

        const clearMagnetic = () => {
          interactiveEl.style.transform = 'translate(0px, 0px)'
          interactiveEl.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }
        interactiveEl.removeEventListener('mouseleave', clearMagnetic)
        interactiveEl.addEventListener('mouseleave', clearMagnetic, { once: true })
      } else {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
        setIsSnapped(false)
        setSnapSize({ width: 28, height: 28, radius: 9999 })

        // Calculate velocity for stretching animation when not snapped
        const now = Date.now()
        const lastTime = lastCoords.current.time || now
        const dt = Math.max(1, now - lastTime)
        const dx = e.clientX - lastCoords.current.x
        const dy = e.clientY - lastCoords.current.y
        const speed = Math.sqrt(dx * dx + dy * dy) / dt

        if (speed > 0.1 && lastCoords.current.time > 0) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          setStretchAngle(angle)
          setStretchScale(Math.min(1.4, 1.0 + speed * 0.18))
        } else {
          setStretchScale(1.0)
        }

        lastCoords.current = { x: e.clientX, y: e.clientY, time: now }
      }
    }

    const handleMouseDown = () => {
      soundManager.playTick()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [mouseX, mouseY, isVisible])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
      {/* Spring Snapping / Stretching Ring */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          rotate: isSnapped ? 0 : stretchAngle,
          scaleX: isSnapped ? 1 : stretchScale,
          scaleY: isSnapped ? 1 : 1 / stretchScale,
        }}
        animate={{
          width: snapSize.width,
          height: snapSize.height,
          borderRadius: snapSize.radius,
          borderColor: isSnapped ? '#22d3ee' : 'rgba(212, 175, 55, 0.35)',
          backgroundColor: isSnapped ? 'rgba(212, 175, 55, 0.05)' : 'rgba(0,0,0,0)',
          borderStyle: 'solid',
          boxShadow: isSnapped ? '0 0 15px rgba(212, 175, 55, 0.15)' : 'none'
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="fixed border flex items-center justify-center"
      />
    </div>
  )
}

export default CustomCursor

