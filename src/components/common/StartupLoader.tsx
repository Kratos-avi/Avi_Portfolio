import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Terminal, Volume2, Shield } from 'lucide-react'
import { soundManager } from '../../utils/SoundManager'

interface StartupLoaderProps {
  onComplete: () => void
}

// System diagnostic logs
const logSteps = [
  'NET: SECURE FIREWALL TCP HANDSHAKES COMPLIANT',
  'MEM: ALLOCATING ECC HARDWARE CACHE ARRAYS',
  'SYS: STAGING AWS INFRASTRUCTURE NODE BLUEPRINTS',
  'SYS: RECONCILING DART/FLUTTER WORKSPACE MODULES',
  'SYS: MOUNTING UNITY C# RIGID-BODY SIMULATOR',
  '3D: COMPILING GLSL GRID MESH VERTEX SHADERS',
  'SYS: ENFORCING AWS IAM LEAST-PRIVILEGE SECURITY',
  'SYS: STAGING HOLOGRAPHIC COMPONENT SCHEMAS',
  'SYSTEM READY. VECTORS COHERENT. PRESS BOOT.'
]

export function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const [volumeSelect, setVolumeSelect] = useState<number>(0.5) // Default 50%
  const [logs, setLogs] = useState<string[]>([
    'SYS: STAGING COCKPIT OS LOADER [VERSION 1.0.8]',
    'NET: SCANNING PORTS AND HOST CHANNELS...',
  ])

  useEffect(() => {
    // Prevent document scroll while booting
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    if (progress < 100) {
      const delay = Math.random() * 140 + 40
      const timer = setTimeout(() => {
        const nextProgress = Math.min(100, progress + Math.floor(Math.random() * 8) + 3)
        setProgress(nextProgress)

        // Add periodic logs based on progress steps
        const logIndex = Math.floor((nextProgress / 100) * logSteps.length)
        if (logIndex > step && logIndex < logSteps.length) {
          setStep(logIndex)
          setLogs(prev => [...prev, logSteps[logIndex]])
          soundManager.playTick()
        }
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [progress, step])

  const handleLaunch = () => {
    // Set sound manager volume and initialize audio context on click gesture
    soundManager.setDroneVolume(volumeSelect)
    soundManager.playSuccess()
    
    // Complete callback
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#070709] flex flex-col items-center justify-center p-4 select-none font-mono"
    >
      {/* HUD scanline overlays */}
      <div className="absolute inset-0 cockpit-scanlines pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-radial-bg-glow opacity-30 pointer-events-none" />

      <div className="w-full max-w-lg border border-white/10 bg-[#0d0d12]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-2xl">
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />

        {/* Diagnostic HUD Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 text-xs text-[#94a3b8]/60">
          <span className="flex items-center gap-1.5 font-bold uppercase text-primary">
            <Terminal className="h-4 w-4" /> AVINASH.S BOOT LOADER
          </span>
          <span>SYSTEM CHECK: {progress}%</span>
        </div>

        {/* Logs terminal box */}
        <div className="flex-1 bg-black/60 rounded-xl p-4 h-[160px] overflow-y-auto font-mono text-[9px] text-[#34D399] space-y-1.5 scrollbar-thin text-left">
          {logs.map((log, idx) => (
            <div key={idx} className={idx === logs.length - 1 ? 'text-primary font-bold' : 'text-emerald-400/85'}>
              &gt; {log}
            </div>
          ))}
        </div>

        {/* Loading Progress Slider */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[10px] text-[#94a3b8]">
            <span>STAGING CORE PARAMETERS</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Audio settings segment */}
        <div className="mt-5 border-t border-white/5 pt-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
            <Volume2 className="h-4 w-4 text-primary" />
            <span>Enable Ambient Cockpit Drone Sound?</span>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'MUTE', vol: 0 },
              { label: '25%', vol: 0.25 },
              { label: '50%', vol: 0.5 },
              { label: '100%', vol: 1.0 }
            ].map((v) => (
              <button
                key={v.vol}
                onClick={() => {
                  soundManager.playTick()
                  setVolumeSelect(v.vol)
                }}
                className={`px-3 py-1.5 rounded-lg border text-[9px] transition-all ${
                  volumeSelect === v.vol
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'bg-[#070709] border-white/5 text-[#94a3b8]/60 hover:border-white/10'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Boot Button */}
        <div className="mt-6 flex justify-center">
          {progress === 100 ? (
            <button
              onClick={handleLaunch}
              className="w-full bg-primary hover:scale-[1.01] text-black text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-transform animate-pulse"
            >
              <Shield className="h-4 w-4 fill-black" />
              <span>INITIALIZE DOCK SYSTEM</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-white/5 text-[#94a3b8]/40 text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 border border-white/5 cursor-wait"
            >
              <Cpu className="h-4 w-4 animate-spin text-[#94a3b8]/30" />
              <span>VERIFYING SYSTEM VECTORS...</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

