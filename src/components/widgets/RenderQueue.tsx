import { useState, useEffect, useRef } from 'react'
import { Play, Square, RefreshCw, Layers } from 'lucide-react'
import { soundManager } from '../../utils/SoundManager'

interface RenderLog {
  timestamp: string
  text: string
  type: 'info' | 'success' | 'warn' | 'upload'
}

export function RenderQueue() {
  const [isRendering, setIsRendering] = useState(false)
  const [engine, setEngine] = useState<'Cycles' | 'Arnold' | 'Eevee'>('Cycles')
  const [resolution, setResolution] = useState<'1080p' | '4K'>('1080p')
  const [rayDepth, setRayDepth] = useState(8)
  const [progress, setProgress] = useState(0)
  const [renderedCount, setRenderedCount] = useState(0)
  const fps = 24
  const [vram, setVram] = useState(0) // MB

  // Block grid status: 'idle' | 'rendering' | 'done'
  const [blocks, setBlocks] = useState<string[]>(Array(36).fill('idle'))
  const [logs, setLogs] = useState<RenderLog[]>([
    { timestamp: '00:00:01', text: 'Render pipeline initialized in standby mode.', type: 'info' },
    { timestamp: '00:00:02', text: 'CUDA cores detected: 4860 active pipelines.', type: 'info' }
  ])

  const logContainerRef = useRef<HTMLDivElement>(null)
  const renderIntervalRef = useRef<number | null>(null)

  // Scroll to bottom of logs on update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
    }
  }, [])

  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'upload' = 'info') => {
    const timeStr = new Date().toTimeString().split(' ')[0]
    setLogs(prev => [...prev, { timestamp: timeStr, text, type }].slice(-50)) // Limit logs to 50
  }

  const startRender = () => {
    if (isRendering) return
    soundManager.playSuccess()
    setIsRendering(true)
    setProgress(0)
    setRenderedCount(0)
    setVram(3420) // Base VRAM allocation
    setBlocks(Array(36).fill('idle'))
    
    addLog(`Staging render task: Engine ${engine} | Output ${resolution} | Diffuse Depth ${rayDepth}`, 'info')
    addLog('Allocating GPU RAM block buffer mapping...', 'info')
    addLog('Staging 3D asset trees and high-density geometry maps...', 'info')

    let currentBlock = 0

    renderIntervalRef.current = window.setInterval(() => {
      // Random VRAM jitter
      setVram(prev => Math.min(8192, Math.max(2000, prev + Math.floor(Math.random() * 400) - 200)))
      
      // Update blocks states
      setBlocks(prev => {
        const next = [...prev]
        if (currentBlock < 36) {
          // Complete previous rendering block
          if (currentBlock > 0) {
            next[currentBlock - 1] = 'done'
          }
          // Set current block to rendering
          next[currentBlock] = 'rendering'
        } else if (currentBlock === 36) {
          next[35] = 'done'
        }
        return next
      })

      // Play sound and increment frame updates
      if (currentBlock < 36) {
        soundManager.playTick()
        setRenderedCount(prev => prev + 1)
        const nextProgress = Math.round(((currentBlock + 1) / 36) * 100)
        setProgress(nextProgress)

        // Periodic logging of render steps
        const logTexts = [
          `Bucket #${currentBlock + 1} processing diffuse ray bounces...`,
          `Applying global illumination filter maps on sub-mesh ${currentBlock}...`,
          `Asset Frame block ${currentBlock + 1} loaded. Syncing denoiser...`,
          `Completed tile render for block index #${currentBlock + 1}.`
        ]
        addLog(logTexts[Math.floor(Math.random() * logTexts.length)], 'info')

        // Occasional cloud sync simulations
        if (currentBlock % 9 === 0 && currentBlock > 0) {
          addLog(`Syncing cache chunk #${currentBlock / 9} to AWS S3 storage...`, 'upload')
        }

        currentBlock++
      } else {
        // Render completed
        if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
        setIsRendering(false)
        setProgress(100)
        soundManager.playSuccess()
        addLog(`Compiling scene sequence successfully in Eevee buffers!`, 'success')
        addLog(`AWS output bucket target updated. Assets fully uploaded.`, 'success')
      }
    }, 150)
  }

  const stopRender = () => {
    if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
    setIsRendering(false)
    setVram(0)
    addLog('Rendering pipeline abort triggered by admin client.', 'warn')
    soundManager.playTick()
  }

  const resetPipeline = () => {
    if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
    setIsRendering(false)
    setProgress(0)
    setRenderedCount(0)
    setVram(0)
    setBlocks(Array(36).fill('idle'))
    setLogs([
      { timestamp: '00:00:01', text: 'Render pipeline refreshed. Standby.', type: 'info' }
    ])
    soundManager.playTick()
  }

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-black/45 select-none relative overflow-hidden flex flex-col h-full min-h-[500px]">
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }} />

      <div className="relative z-10 flex flex-col flex-1 gap-6">
        
        {/* Header HUD Status */}
        <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3D Render Queue Simulator</h3>
              <p className="text-[10px] text-[#94a3b8]/60 font-mono">Telemetry Host: Swaminarayan RenderFarm-1</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#94a3b8]/80 mt-2 sm:mt-0">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isRendering ? 'bg-amber-500 animate-ping' : 'bg-emerald-400'}`} />
              {isRendering ? 'PROCESSING' : 'STANDBY'}
            </span>
            <span>VRAM: {vram > 0 ? `${vram} MB` : '0 MB'}</span>
          </div>
        </div>

        {/* Configuration sliders/menus grid */}
        <div className="grid gap-4 sm:grid-cols-3 text-xs bg-white/[0.01] border border-white/5 rounded-2xl p-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#94a3b8]/60 block mb-1">Renderer Engine</label>
            <select
              value={engine}
              disabled={isRendering}
              onChange={(e) => {
                soundManager.playTick()
                setEngine(e.target.value as 'Cycles' | 'Arnold' | 'Eevee')
              }}
              className="w-full bg-[#0d0d12] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#f8fafc] focus:outline-none focus:border-primary"
            >
              <option value="Cycles">Blender Cycles (GPU PathTrace)</option>
              <option value="Arnold">Autodesk Arnold Core</option>
              <option value="Eevee">Blender Eevee Real-time</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#94a3b8]/60 block mb-1">Max Path Depth ({rayDepth})</label>
            <input 
              type="range"
              min="2"
              max="24"
              value={rayDepth}
              disabled={isRendering}
              onChange={(e) => {
                soundManager.playTick()
                setRayDepth(Number(e.target.value))
              }}
              className="w-full h-1.5 bg-[#0d0d12] rounded-lg appearance-none cursor-pointer accent-primary mt-3"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#94a3b8]/60 block mb-1">Target Resolution</label>
            <div className="flex gap-2 mt-1">
              {['1080p', '4K'].map((res) => (
                <button
                  key={res}
                  disabled={isRendering}
                  onClick={() => {
                    soundManager.playTick()
                    setResolution(res as '1080p' | '4K')
                  }}
                  className={`flex-1 py-1 rounded-md font-mono text-[10px] transition-all border ${
                    resolution === res 
                      ? 'bg-primary/15 border-primary text-primary' 
                      : 'bg-[#0d0d12] border-white/5 text-[#94a3b8] hover:border-white/10'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mid section: Block Render visualizer and details */}
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Active tiles render bucket grid */}
          <div className="space-y-3">
            <span className="text-[9px] uppercase tracking-widest text-[#94a3b8]/75 font-mono block">
              Frame Bucket Processing Grid (36 Tiles)
            </span>
            <div className="grid grid-cols-6 gap-2 bg-[#0d0d12]/40 border border-white/5 rounded-2xl p-4 aspect-square">
              {blocks.map((status, index) => (
                <div
                  key={index}
                  className={`w-full aspect-square rounded-md border transition-all duration-300 ${
                    status === 'done'
                      ? 'bg-primary/15 border-primary shadow-[0_0_8px_var(--primary-glow)]'
                      : status === 'rendering'
                      ? 'bg-amber-500/20 border-amber-500 animate-pulse'
                      : 'bg-[#0d0d12]/80 border-white/5'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Render progress data specs */}
          <div className="space-y-4">
            <span className="text-[9px] uppercase tracking-widest text-[#94a3b8]/75 font-mono block">
              Pipeline Parameters
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0d0d12]/50 border border-white/5 p-3 rounded-xl">
                <span className="text-[8px] uppercase text-[#94a3b8]/60 block font-mono">Render Completion</span>
                <span className="text-xl font-bold font-mono text-white block mt-1">{progress}%</span>
              </div>
              <div className="bg-[#0d0d12]/50 border border-white/5 p-3 rounded-xl">
                <span className="text-[8px] uppercase text-[#94a3b8]/60 block font-mono">Tiles Rendered</span>
                <span className="text-xl font-bold font-mono text-white block mt-1">{renderedCount} / 36</span>
              </div>
              <div className="bg-[#0d0d12]/50 border border-white/5 p-3 rounded-xl">
                <span className="text-[8px] uppercase text-[#94a3b8]/60 block font-mono">Active FPS Limit</span>
                <span className="text-xl font-bold font-mono text-white block mt-1">{isRendering ? fps : '0'}</span>
              </div>
              <div className="bg-[#0d0d12]/50 border border-white/5 p-3 rounded-xl">
                <span className="text-[8px] uppercase text-[#94a3b8]/60 block font-mono">AWS VPC Tunnel</span>
                <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">SECURE</span>
              </div>
            </div>

            {/* Custom linear progress bar */}
            <div className="w-full bg-[#0d0d12] rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Operations controls buttons deck */}
            <div className="flex gap-2">
              {!isRendering ? (
                <button
                  onClick={startRender}
                  className="flex-1 bg-primary hover:scale-[1.02] text-black text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Start Render</span>
                </button>
              ) : (
                <button
                  onClick={stopRender}
                  className="flex-1 bg-red-500 hover:scale-[1.02] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all animate-pulse"
                >
                  <Square className="h-3.5 w-3.5 fill-white" />
                  <span>Halt Task</span>
                </button>
              )}
              <button
                onClick={resetPipeline}
                className="p-2.5 bg-[#0d0d12] border border-white/10 hover:border-primary/30 rounded-xl text-[#94a3b8] hover:text-white transition-colors"
                title="Reset Pipeline"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom logs stack */}
        <div className="flex-1 flex flex-col min-h-[140px] max-h-[180px]">
          <span className="text-[9px] uppercase tracking-widest text-[#94a3b8]/75 font-mono block mb-2">
            Rendering Console Output
          </span>
          <div 
            ref={logContainerRef}
            className="flex-1 bg-[#07070a] border border-white/5 rounded-2xl p-4 font-mono text-[9px] overflow-y-auto space-y-1.5 scrollbar-thin select-text text-left"
          >
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#94a3b8]/40 flex-none font-bold">[{log.timestamp}]</span>
                <span className={
                  log.type === 'success' 
                    ? 'text-emerald-400 font-bold' 
                    : log.type === 'warn' 
                    ? 'text-red-400 animate-pulse' 
                    : log.type === 'upload' 
                    ? 'text-indigo-400 font-semibold' 
                    : 'text-[#94a3b8]/80'
                }>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

