import { soundManager } from '../../utils/SoundManager'
import { Volume2, VolumeX, RefreshCw, Layers, Radio } from 'lucide-react'
import { useState } from 'react'

interface InteractiveConsoleProps {
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
}

export function InteractiveConsole({
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
}: InteractiveConsoleProps) {
  const [muted, setMuted] = useState(soundManager.isMuted)

  const handleAudioToggle = () => {
    const nextMute = soundManager.toggleMute()
    setMuted(nextMute)
    if (!nextMute) {
      soundManager.playSuccess()
    }
  }

  const handleSliderChange = (
    type: 'gravity' | 'speed' | 'density',
    val: number
  ) => {
    soundManager.playTick()
    if (type === 'gravity') setGravity(val)
    if (type === 'speed') setSpeed(val)
    if (type === 'density') setDensity(val)
  }

  const handleThemeChange = (colorTheme: string) => {
    soundManager.playSuccess()
    setTheme(colorTheme)
  }

  const handleToggle = (type: 'wireframe' | 'glitch') => {
    soundManager.playSuccess()
    if (type === 'wireframe') setWireframe(!wireframe)
    if (type === 'glitch') setGlitch(!glitch)
  }

  const handleReset = () => {
    soundManager.playSuccess()
    setGravity(0.15)
    setSpeed(1.0)
    setDensity(1.0)
    setTheme('gold')
    setWireframe(true)
    setGlitch(false)
  }

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full border border-white/5 bg-[#101012]/60 select-none">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Physics Sandbox Console
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAudioToggle}
              className={`p-1.5 rounded-lg border transition-colors ${
                muted
                  ? 'border-white/10 text-white/40 hover:text-white/60'
                  : 'border-primary/30 text-primary hover:bg-primary/10'
              }`}
              title={muted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white/60 transition-colors"
              title="Reset Parameters"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-[#94a3b8] mb-6 leading-relaxed">
          Tweak the gravitational fields of the 3D spiral galaxy core in real-time. Modifies the Keplerian orbital simulation thread.
        </p>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#94a3b8]/80 mb-1">
              <span>Core Gravity Pull</span>
              <span className="font-mono text-primary">{gravity.toFixed(2)}G</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={gravity}
              onChange={(e) => handleSliderChange('gravity', parseFloat(e.target.value))}
              className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#94a3b8]/80 mb-1">
              <span>Galactic Core Spin (Speed)</span>
              <span className="font-mono text-primary">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.2"
              step="0.1"
              value={speed}
              onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
              className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#94a3b8]/80 mb-1">
              <span>Starfield Density</span>
              <span className="font-mono text-primary">{density.toFixed(2)}d</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.4"
              step="0.05"
              value={density}
              onChange={(e) => handleSliderChange('density', parseFloat(e.target.value))}
              className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center bg-black/30 border border-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-white">Concentric Orbit Radars</span>
                <span className="text-[9px] text-[#94a3b8]/60">Toggle coordinates orbital vector radar grids</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle('wireframe')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${
                wireframe ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-black transition-transform duration-300 ${
                  wireframe ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center bg-black/30 border border-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-white">Solar Dust Glitch</span>
                <span className="text-[9px] text-[#94a3b8]/60">Activate solar wind particle scanlines and distortion</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle('glitch')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative ${
                glitch ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-black transition-transform duration-300 ${
                  glitch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Theme Picker */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <span className="text-[10px] font-bold text-[#94a3b8]/70 uppercase tracking-widest block mb-3">
          Cosmic Spectrum Matrix
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'gold', label: 'Gold', hex: '#d4af37', bg: 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' },
            { id: 'matrix', label: 'Aurora', hex: '#34D399', bg: 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]' },
            { id: 'cyan', label: 'Cyan', hex: '#22D3EE', bg: 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]' },
            { id: 'crimson', label: 'Nebula', hex: '#EF4444', bg: 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]' },
          ].map((themeOpt) => {
            const isSelected = theme === themeOpt.id
            return (
              <button
                key={themeOpt.id}
                onClick={() => handleThemeChange(themeOpt.id)}
                className={`py-1.5 rounded text-[9px] uppercase tracking-wider font-semibold border text-center transition-all ${
                  isSelected
                    ? themeOpt.bg + ' text-white scale-[1.03]'
                    : 'border-white/5 bg-black/30 text-[#94a3b8]/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {themeOpt.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

