import { motion } from 'framer-motion'
import { Tv, ArrowRight } from 'lucide-react'
import { WordsPullUp } from '../common/WordsPullUp'
import { InteractiveConsole } from '../widgets/InteractiveConsole'

const motionEase = [0.16, 1, 0.3, 1] as const

interface HeroProps {
  gravity: number
  setGravity: (v: number) => void
  speed: number
  setSpeed: (v: number) => void
  density: number
  setDensity: (v: number) => void
  theme: string
  setTheme: (t: string) => void
  wireframe: boolean
  setWireframe: (w: boolean) => void
  glitch: boolean
  setGlitch: (g: boolean) => void
  cpuLoad: number
  pingTime: number
  telemetryLogs: string[]
  handleInteraction: () => void
}

export function Hero({
  gravity,
  setGravity,
  speed,
  setSpeed,
  density,
  setDensity,
  theme,
  setTheme,
  wireframe,
  setWireframe,
  glitch,
  setGlitch,
  cpuLoad,
  pingTime,
  telemetryLogs,
  handleInteraction,
}: HeroProps) {
  return (
    <section id="hero" className="scroll-section relative min-h-screen overflow-hidden flex items-center px-4 pt-24 pb-12 md:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070709]/30 to-[#070709] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center">
        {/* Hero Left Content */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: motionEase }}
          >
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] text-primary mb-4">
              Creative Technologist & Systems Developer
            </span>
          </motion.div>
          
          <WordsPullUp
            text="Avinash"
            className="text-[14vw] font-medium leading-[0.8] tracking-[-0.08em] text-[#f8fafc] sm:text-[11vw] md:text-[8.5vw] lg:text-[7vw]"
          />
          <WordsPullUp
            text="Suhagiya"
            className="-mt-1 text-[14vw] font-medium leading-[0.8] tracking-[-0.08em] text-primary sm:text-[11vw] md:text-[8.5vw] lg:text-[7vw]"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: motionEase }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-[#94a3b8] max-w-[48ch]"
          >
            IT Support Specialist & Mobile/Web Developer. Staging networks, repairing workstation mainboards, deploying automated AWS architectures via Terraform, and scripting Unity/C# gameplay loops.
          </motion.p>
          
          {/* Real-time System Telemetry HUD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: motionEase }}
            data-cursor-text="TELEMETRY REAL-TIME DIAGNOSTIC LOOPS"
            className="mt-6 border border-white/5 bg-black/45 backdrop-blur-md rounded-xl p-4 max-w-lg font-mono text-[10px] text-[#34D399] select-none shadow-lg"
          >
            <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
              <span className="text-white/60 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <Tv className="h-3.5 w-3.5 text-primary" /> Telemetry Stream
              </span>
              <span className="text-white/40">CPU: {cpuLoad}% | PING: {pingTime}ms</span>
            </div>
            <div className="space-y-1.5">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className={idx === 0 ? 'text-primary' : 'text-emerald-400/75'}>
                  {log}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: motionEase }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#contact"
              onMouseEnter={handleInteraction}
              data-cursor-text="TRANSMIT MESSAGE SECURE CORNER"
              data-magnetic
              className="group btn-shimmer inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="btn-label-slide">
                <span className="btn-label-slide__inner">
                  Establish Contact
                  <span className="btn-label-slide__hover">Establish Contact</span>
                </span>
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4 text-primary" />
              </span>
            </a>
            <a
              href="#features"
              onMouseEnter={handleInteraction}
              data-cursor-text="JUMP TO SPECIFICATION GRID"
              data-magnetic
              className="btn-shimmer inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <span className="btn-label-slide">
                <span className="btn-label-slide__inner">
                  Diagnostic Specs
                  <span className="btn-label-slide__hover">Diagnostic Specs</span>
                </span>
              </span>
            </a>
          </motion.div>
        </div>

        {/* Hero Right Cockpit Console (Physics Sandbox Console) */}
        <div className="w-full" data-cursor-text="MUTATE SINE WAVE PERSPECTIVE">
          <InteractiveConsole
            gravity={gravity}
            setGravity={setGravity}
            speed={speed}
            setSpeed={setSpeed}
            density={density}
            setDensity={setDensity}
            theme={theme}
            setTheme={setTheme}
            wireframe={wireframe}
            setWireframe={setWireframe}
            glitch={glitch}
            setGlitch={setGlitch}
          />
        </div>
      </div>
    </section>
  )
}

export default Hero

