import { useEffect, useRef, useState } from 'react'
import { soundManager } from '../../utils/SoundManager'
import { Play, RotateCcw, Shield } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

interface Obstacle {
  x: number
  y: number
  radius: number
}

const OBSTACLES: Obstacle[] = [
  { x: 100, y: 110, radius: 20 },
  { x: 200, y: 70, radius: 24 },
  { x: 300, y: 110, radius: 20 }
]

export function GameSim() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  
  // Physics Parameters
  const [gravity, setGravity] = useState(0.35)
  const [bounciness, setBounciness] = useState(0.7)
  const [obstaclesActive, setObstaclesActive] = useState(true)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 220

    let animationFrameId: number

    const updatePhysics = () => {
      // Wind drift vector based on a subtle sine wave
      const wind = Math.sin(Date.now() * 0.001) * 0.02
      
      const particles = [...particlesRef.current]

      particles.forEach((p) => {
        // 1. Apply Forces
        p.vy += gravity
        p.vx += wind

        // 2. Update Coordinates
        p.x += p.vx
        p.y += p.vy

        // 3. Collision Checks: Walls
        const bounceLimit = bounciness

        // Floor
        if (p.y > canvas.height - p.radius) {
          p.y = canvas.height - p.radius
          p.vy = -p.vy * bounceLimit
          p.vx *= 0.95 // Friction drag
          if (Math.abs(p.vy) > 0.4) {
            soundManager.playTick()
          }
        }
        // Ceiling
        if (p.y < p.radius) {
          p.y = p.radius
          p.vy = -p.vy * bounceLimit
        }
        // Left Wall
        if (p.x < p.radius) {
          p.x = p.radius
          p.vx = -p.vx * bounceLimit
          if (Math.abs(p.vx) > 0.4) soundManager.playTick()
        }
        // Right Wall
        if (p.x > canvas.width - p.radius) {
          p.x = canvas.width - p.radius
          p.vx = -p.vx * bounceLimit
          if (Math.abs(p.vx) > 0.4) soundManager.playTick()
        }

        // 4. Collision Checks: Static Circular Obstacles
        if (obstaclesActive) {
          OBSTACLES.forEach((obs) => {
            const dx = p.x - obs.x
            const dy = p.y - obs.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const minDist = p.radius + obs.radius

            if (dist < minDist) {
              // Resolve intersection
              const overlap = minDist - dist
              const nx = dx / dist // Normal X
              const ny = dy / dist // Normal Y

              // Reposition particle outside overlap
              p.x += nx * overlap
              p.y += ny * overlap

              // Calculate dot product vector reflection
              const k = p.vx * nx + p.vy * ny
              p.vx = (p.vx - 2 * k * nx) * bounceLimit
              p.vy = (p.vy - 2 * k * ny) * bounceLimit

              soundManager.playTick()
            }
          })
        }
      })

      particlesRef.current = particles

      // 5. Draw Frame
      ctx.fillStyle = '#070709'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.lineWidth = 1
      const size = 20
      for (let x = 0; x < canvas.width; x += size) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += size) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }

      // Draw Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
 
      const primaryColor = document.documentElement.style.getPropertyValue('--primary').trim() || '#22d3ee'

      // Draw Static Obstacles
      if (obstaclesActive) {
        OBSTACLES.forEach((obs) => {
          ctx.beginPath()
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2)
          ctx.fillStyle = primaryColor === '#34d399' ? 'rgba(52, 211, 153, 0.12)' :
                          primaryColor === '#ef4444' ? 'rgba(239, 68, 68, 0.12)' :
                          primaryColor === '#d4af37' ? 'rgba(212, 175, 55, 0.12)' :
                          'rgba(34, 211, 238, 0.12)'
          ctx.fill()
          ctx.strokeStyle = primaryColor
          ctx.lineWidth = 1
          ctx.stroke()
 
          // Draw inner pin node
          ctx.beginPath()
          ctx.arc(obs.x, obs.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = primaryColor
          ctx.fill()
        })
      }

      // Draw Bouncing Particles
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.stroke()
      })

      animationFrameId = requestAnimationFrame(updatePhysics)
    }

    updatePhysics()

    return () => cancelAnimationFrame(animationFrameId)
  }, [gravity, bounciness, obstaclesActive])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    
    // Scale client click position to internal canvas coordinates
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width)
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height)

    soundManager.playSuccess()
    setIsEmpty(false)

    // Add a bouncing particle
    const primaryColor = document.documentElement.style.getPropertyValue('--primary').trim() || '#22d3ee'
    const colors = [primaryColor, '#a855f7', '#3b82f6']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
 
    particlesRef.current.push({
      x: clickX,
      y: clickY,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 2 - 2, // minor upwards push
      radius: Math.random() * 4 + 5, // radius between 5 and 9
      color: randomColor
    })
 
    // Cap particle list at 24 to preserve processor memory
    if (particlesRef.current.length > 24) {
      particlesRef.current.shift()
    }
  }

  const handleReset = () => {
    soundManager.playSuccess()
    particlesRef.current = []
    setIsEmpty(true)
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#101012]/60 select-none">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
          2D Vector Physics Simulator
        </span>
        <button
          onClick={handleReset}
          className="p-1 rounded border border-white/10 hover:border-primary text-white/50 hover:text-white transition-colors"
          title="Clear Particles"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Physics Canvas */}
      <div className="relative w-full h-[220px] bg-black/45 rounded-xl overflow-hidden flex items-center justify-center cursor-crosshair">
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className="w-full h-full max-w-[400px]" 
        />
        {isEmpty && (
          <div className="absolute pointer-events-none text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-2 animate-pulse">
            <Play className="h-3.5 w-3.5" /> Click inside canvas to drop particles
          </div>
        )}
      </div>

      {/* Controls HUD */}
      <div className="mt-5 space-y-4 font-mono text-[10px] text-[#94a3b8]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Gravity Force</span>
              <span className="text-primary">{gravity.toFixed(2)}G</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={gravity}
              onChange={(e) => {
                soundManager.playTick()
                setGravity(parseFloat(e.target.value))
              }}
              className="w-full h-1 bg-black rounded appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Restitution (Bounces)</span>
              <span className="text-primary">{bounciness.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={bounciness}
              onChange={(e) => {
                soundManager.playTick()
                setBounciness(parseFloat(e.target.value))
              }}
              className="w-full h-1 bg-black rounded appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-[9px] uppercase tracking-wider">Obstacle Deflectors Staging</span>
          </div>
          <button
            onClick={() => {
              soundManager.playSuccess()
              setObstaclesActive(!obstaclesActive)
            }}
            className={`px-3 py-1 rounded border text-[9px] uppercase tracking-wider font-semibold transition-colors ${
              obstaclesActive
                ? 'border-primary bg-primary/10 text-white'
                : 'border-white/5 bg-black/40 text-[#94a3b8]/60 hover:border-white/10'
            }`}
          >
            {obstaclesActive ? 'ACTIVE' : 'STAGED'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default GameSim

