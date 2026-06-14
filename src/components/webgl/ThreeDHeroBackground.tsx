import { useEffect, useRef } from 'react'

interface ThreeDHeroBackgroundProps {
  gravity: number
  speed: number
  theme: string
  density: number
  wireframe: boolean
  glitch: boolean
}

export function ThreeDHeroBackground({
  gravity,
  speed,
  theme,
  density,
  wireframe,
  glitch,
}: ThreeDHeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const angleRef = useRef({ x: 0.45, y: -0.45 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      const mx = (e.clientX / window.innerWidth) - 0.5
      const my = (e.clientY / window.innerHeight) - 0.5
      
      angleRef.current = {
        x: 0.35 + my * 0.4,
        y: -0.35 + mx * 0.4
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    handleResize()

    const getThemeColors = () => {
      switch (theme) {
        case 'matrix':
          return { dot: 'rgba(52, 211, 153, 0.65)', line: 'rgba(52, 211, 153, 0.14)' }
        case 'cyan':
          return { dot: 'rgba(34, 211, 238, 0.65)', line: 'rgba(34, 211, 238, 0.14)' }
        case 'crimson':
          return { dot: 'rgba(239, 68, 68, 0.65)', line: 'rgba(239, 68, 68, 0.14)' }
        case 'gold':
        default:
          return { dot: 'rgba(212, 175, 55, 0.65)', line: 'rgba(212, 175, 55, 0.14)' }
      }
    }

    const spacing = 42
    const baseCols = 26
    const baseRows = 26

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cols = Math.floor(baseCols * density)
      const rows = Math.floor(baseRows * density)

      const cx = canvas.width / 2
      const cy = canvas.height / 2.3

      // Capture scroll fraction
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollFraction = Math.min(1, Math.max(0, scrollY / maxScroll))

      // Rotate camera layout based on scroll
      const targetAngleX = 0.35 + scrollFraction * 0.85
      const targetAngleY = -0.35 - scrollFraction * 0.12

      const cosX = Math.cos(targetAngleX + (angleRef.current.x - 0.35) * 0.6)
      const sinX = Math.sin(targetAngleX + (angleRef.current.x - 0.35) * 0.6)
      const cosY = Math.cos(targetAngleY + (angleRef.current.y + 0.35) * 0.6)
      const sinY = Math.sin(targetAngleY + (angleRef.current.y + 0.35) * 0.6)

      const themeColors = getThemeColors()
      const projectedGrid: Array<Array<{ px: number; py: number; alpha: number } | null>> = []

      time += 0.02 * speed

      // Simulate canvas matrix glitch sweep
      const isGlitchFrame = glitch && Math.random() > 0.985
      const horizontalOffset = isGlitchFrame ? (Math.random() - 0.5) * 18 : 0

      for (let r = 0; r < rows; r++) {
        projectedGrid[r] = []
        for (let c = 0; c < cols; c++) {
          const gx = (c - cols / 2) * spacing
          const gz = (r - rows / 2) * spacing

          const distFromCenter = Math.sqrt(gx * gx + gz * gz)
          let gy = Math.sin(distFromCenter * 0.015 - time) * (35 + scrollFraction * 20)

          gy *= (1 - gravity * 0.5)

          const mouseXOffset = mouseRef.current.x - cx
          const mouseYOffset = mouseRef.current.y - cy

          const dx = gx - mouseXOffset
          const dz = gz - (mouseYOffset * 1.5)
          const mouseDist = Math.sqrt(dx * dx + dz * dz)

          if (mouseDist < 160) {
            const rippleForce = (160 - mouseDist) / 160
            gy += Math.sin(mouseDist * 0.05 + time * 2) * 25 * rippleForce
          }

          const xRot = gx * cosY - gz * sinY
          let zRot = gz * cosY + gx * sinY

          const yRot = gy * cosX - zRot * sinX
          zRot = zRot * cosX + gy * sinX

          const cameraDepth = 600 - scrollFraction * 220
          if (zRot + cameraDepth > 10) {
            const scale = cameraDepth / (cameraDepth + zRot)
            let px = cx + xRot * scale
            let py = cy + yRot * scale

            // Apply glitch coordinate anomalies
            if (isGlitchFrame && Math.random() > 0.6) {
              px += (Math.random() - 0.5) * 6
              py += (Math.random() - 0.5) * 6
            }
            px += horizontalOffset

            const alpha = Math.max(0, Math.min(1, (1.2 - zRot / 400)))

            projectedGrid[r][c] = { px, py, alpha }
          } else {
            projectedGrid[r][c] = null
          }
        }
      }

      ctx.lineWidth = 0.65
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = projectedGrid[r][c]
          if (!pt) continue

          // 1. Draw connection mesh lines (ONLY in wireframe or normal modes)
          if (wireframe) {
            if (c < cols - 1) {
              const nextPt = projectedGrid[r][c + 1]
              if (nextPt) {
                ctx.beginPath()
                ctx.moveTo(pt.px, pt.py)
                ctx.lineTo(nextPt.px, nextPt.py)
                ctx.strokeStyle = themeColors.line
                ctx.stroke()
              }
            }

            if (r < rows - 1) {
              const nextPt = projectedGrid[r + 1][c]
              if (nextPt) {
                ctx.beginPath()
                ctx.moveTo(pt.px, pt.py)
                ctx.lineTo(nextPt.px, nextPt.py)
                ctx.strokeStyle = themeColors.line
                ctx.stroke()
              }
            }
          }

          // 2. Draw point nodes (ONLY if NOT in pure wireframe mode, or draw them faintly)
          ctx.beginPath()
          ctx.arc(pt.px, pt.py, 1.25, 0, Math.PI * 2)
          ctx.fillStyle = themeColors.dot
          ctx.fill()
        }
      }

      // Draw horizontal glitch green scanlines
      if (glitch && Math.random() > 0.9) {
        ctx.beginPath()
        ctx.rect(0, Math.random() * canvas.height, canvas.width, 1.5)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [gravity, speed, theme, density, wireframe, glitch])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-55"
    />
  )
}

