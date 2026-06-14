import { useEffect, useRef, useState } from 'react'

interface TagItem {
  text: string
  ring: 0 | 1 | 2 // 0 = Inner (IT), 1 = Middle (Fullstack), 2 = Outer (DevOps & Game Dev)
  x: number
  y: number
  z: number
  x2d: number
  y2d: number
  scale: number
  alpha: number
}

// Group tags by ring depth
const INNER_TAGS = ['LAN/WAN', 'Firewalls', 'Diagnostics', 'Terminals', 'Routing', 'Linux OS', 'Bash']
const MIDDLE_TAGS = ['Flutter', 'NodeJS', 'Express', 'Kotlin', 'MySQL', 'SQLite', 'JWT Auth', 'REST API', 'JavaScript']
const OUTER_TAGS = ['AWS Cloud', 'Terraform', 'C# / Unity', 'Game Physics', 'Figma UI', 'Git/GitHub', 'CI/CD']

export function TechOrbit() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  // Set up three concentric rings in state
  const [items, setItems] = useState<TagItem[]>(() => {
    const radiusInner = 100
    const radiusMiddle = 175
    const radiusOuter = 245

    const itemsList: TagItem[] = []

    // 1. Inner Ring (IT)
    INNER_TAGS.forEach((tag, i) => {
      const theta = (i / INNER_TAGS.length) * Math.PI * 2
      itemsList.push({
        text: tag,
        ring: 0,
        x: radiusInner * Math.cos(theta),
        y: 0,
        z: radiusInner * Math.sin(theta),
        x2d: 0,
        y2d: 0,
        scale: 1,
        alpha: 1,
      })
    })

    // 2. Middle Ring (Full-Stack)
    MIDDLE_TAGS.forEach((tag, i) => {
      const theta = (i / MIDDLE_TAGS.length) * Math.PI * 2
      itemsList.push({
        text: tag,
        ring: 1,
        x: radiusMiddle * Math.cos(theta),
        y: radiusMiddle * Math.sin(theta) * 0.25, // skewed tilt orbit
        z: radiusMiddle * Math.sin(theta),
        x2d: 0,
        y2d: 0,
        scale: 1,
        alpha: 1,
      })
    })

    // 3. Outer Ring (DevOps/Game Dev)
    OUTER_TAGS.forEach((tag, i) => {
      const theta = (i / OUTER_TAGS.length) * Math.PI * 2
      itemsList.push({
        text: tag,
        ring: 2,
        x: radiusOuter * Math.cos(theta),
        y: -radiusOuter * Math.sin(theta) * 0.25, // opposite skew
        z: radiusOuter * Math.sin(theta),
        x2d: 0,
        y2d: 0,
        scale: 1,
        alpha: 1,
      })
    })

    return itemsList
  })

  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      
      const mx = (e.clientX - cx) / (rect.width / 2)
      const my = (e.clientY - cy) / (rect.height / 2)
      
      mouseRef.current = { x: mx, y: my }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number

    // Velocities for X and Y axes for the three rings
    const velocities = {
      ring0: { rx: 0.005, ry: 0.005 },
      ring1: { rx: -0.003, ry: 0.003 },
      ring2: { rx: 0.002, ry: -0.002 }
    }

    const update = () => {
      // Mouse coefficients
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Dynamic adjustments based on mouse drag/hover
      const rx0 = velocities.ring0.rx - my * 0.015
      const ry0 = velocities.ring0.ry + mx * 0.015

      const rx1 = velocities.ring1.rx + my * 0.01
      const ry1 = velocities.ring1.ry - mx * 0.01

      const rx2 = velocities.ring2.rx - my * 0.005
      const ry2 = velocities.ring2.ry + mx * 0.005

      // Precompute sines and cosines
      const c0x = Math.cos(rx0), s0x = Math.sin(rx0)
      const c0y = Math.cos(ry0), s0y = Math.sin(ry0)

      const c1x = Math.cos(rx1), s1x = Math.sin(rx1)
      const c1y = Math.cos(ry1), s1y = Math.sin(ry1)

      const c2x = Math.cos(rx2), s2x = Math.sin(rx2)
      const c2y = Math.cos(ry2), s2y = Math.sin(ry2)

      setItems((prevItems) =>
        prevItems.map((item) => {
          let cxVal = c0x, sxVal = s0x, cyVal = c0y, syVal = s0y

          if (item.ring === 1) {
            cxVal = c1x; sxVal = s1x; cyVal = c1y; syVal = s1y
          } else if (item.ring === 2) {
            cxVal = c2x; sxVal = s2x; cyVal = c2y; syVal = s2y
          }

          // Rotate X-axis
          const y1 = item.y * cxVal - item.z * sxVal
          const z1 = item.z * cxVal + item.y * sxVal

          // Rotate Y-axis
          const x2 = item.x * cyVal - z1 * syVal
          const z2 = z1 * cyVal + item.x * syVal

          const depth = 380
          const scale = depth / (depth + z2)

          return {
            ...item,
            x: x2,
            y: y1,
            z: z2,
            x2d: x2,
            y2d: y1,
            scale,
            alpha: (scale - 0.45) * 1.6,
          }
        })
      )

      animationFrameId = requestAnimationFrame(update)
    }

    update()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex h-[480px] w-[480px] items-center justify-center overflow-hidden"
    >
      {/* Visual concentric orbit grid rings in background */}
      <div className="absolute h-[200px] w-[200px] rounded-full border border-white/5 select-none pointer-events-none" />
      <div className="absolute h-[350px] w-[350px] rounded-full border border-dashed border-white/5 select-none pointer-events-none rotate-12" />
      <div className="absolute h-[480px] w-[480px] rounded-full border border-white/5 select-none pointer-events-none -rotate-12" />
      
      <div className="relative h-[440px] w-[440px]">
        {items.map((item, idx) => {
          // Center coordinate positioning
          const left = 220 + item.x2d * item.scale
          const top = 220 + item.y2d * item.scale

          const zIndex = Math.round(item.scale * 100)

          // Color tags by orbit rings
          const getRingStyle = (ring: number) => {
            switch (ring) {
              case 2: // Outer: Gold DevOps/Game
                return 'border-[#22d3ee]/30 bg-[#16161a]/85 text-[#22d3ee] hover:border-[#22d3ee]'
              case 1: // Middle: Cyan Fullstack
                return 'border-[#22D3EE]/30 bg-[#101012]/85 text-[#22D3EE] hover:border-[#22D3EE]'
              case 0: // Inner: Emerald IT
              default:
                return 'border-[#34D399]/30 bg-[#070709]/85 text-[#34D399] hover:border-[#34D399]'
            }
          };

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                transform: `translate(-50%, -50%) scale(${item.scale})`,
                opacity: item.alpha,
                zIndex: zIndex,
                transition: 'color 0.2s, border-color 0.2s',
              }}
              className={`cursor-default select-none rounded-full border px-3 py-1.5 text-[10px] font-mono font-bold shadow-md backdrop-blur-[2px] transition-all duration-300 ${getRingStyle(
                item.ring
              )}`}
            >
              {item.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

