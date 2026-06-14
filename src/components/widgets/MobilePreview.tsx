import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Battery, 
  Wifi, 
  Signal, 
  CheckSquare, 
  Settings, 
  Home, 
  Check, 
  Database,
  CloudLightning,
  AlertCircle
} from 'lucide-react'
import { soundManager } from '../../utils/SoundManager'

interface TaskItem {
  id: number
  title: string
  completed: boolean
}

export function MobilePreview() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'settings'>('dashboard')
  const [time, setTime] = useState('09:41')
  
  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, title: 'AWS VPC Terraform Config', completed: true },
    { id: 2, title: 'Kotlin SQLite DB Migration', completed: true },
    { id: 3, title: 'Unity C# Rigid-Body Physics', completed: false },
    { id: 4, title: 'Store POS Diagnostics Support', completed: false },
    { id: 5, title: 'Secure JWT Auth Token Layer', completed: false },
  ])

  // Settings state
  const [syncCloud, setSyncCloud] = useState(true)
  const [debugLogs, setDebugLogs] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  // Update mock phone clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setTime(`${hours}:${minutes}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed
        if (nextCompleted) {
          soundManager.playSuccess()
        } else {
          soundManager.playTick()
        }
        return { ...t, completed: nextCompleted }
      }
      return t
    }))
  }

  const handleTabClick = (tab: 'dashboard' | 'tasks' | 'settings') => {
    soundManager.playTick()
    setActiveTab(tab)
  }

  const completedCount = tasks.filter(t => t.completed).length
  const completionPercent = Math.round((completedCount / tasks.length) * 100)

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      {/* Outer Smartphone Bezels Wrapper */}
      <div className="relative mx-auto w-[310px] h-[610px] bg-[#0d0d12] rounded-[3.25rem] p-3 shadow-2xl border-4 border-white/10 hover:border-primary/30 transition-colors duration-500 group select-none">
        
        {/* Notch and Speaker Grill */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#0d0d12] rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-16 h-1 bg-white/10 rounded-full mb-1" />
        </div>

        {/* Side Hardware Buttons */}
        <div className="absolute -left-1.5 top-28 w-1 h-12 bg-white/15 rounded-r-md" />
        <div className="absolute -left-1.5 top-44 w-1 h-14 bg-white/15 rounded-r-md" />
        <div className="absolute -right-1.5 top-36 w-1 h-16 bg-white/15 rounded-l-md" />

        {/* Inner Glass Screen */}
        <div className="relative w-full h-full bg-[#08080c] rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col">
          
          {/* Status Bar */}
          <div className="h-10 pt-4 px-6 flex justify-between items-center text-[10px] text-white/70 font-mono z-20">
            <span>{time}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="h-3 w-3 text-primary" />
              <Wifi className="h-3 w-3 text-primary" />
              <Battery className="h-3.5 w-3.5 text-white/70" />
            </div>
          </div>

          {/* Core Content Viewport with Screen Transitions */}
          <div className="flex-1 p-5 overflow-y-auto relative scrollbar-none">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 pt-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Dev Cockpit</h4>
                      <p className="text-[9px] text-[#94a3b8]">Flutter Engine v3.19.2</p>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <CloudLightning className="h-3 w-3 text-primary animate-pulse" />
                    </div>
                  </div>

                  {/* Progress Gauge Card */}
                  <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[#94a3b8]/60 font-bold block mb-1">
                        Task Progress
                      </span>
                      <span className="text-2xl font-bold text-white font-mono">{completionPercent}%</span>
                      <span className="block text-[8px] text-[#94a3b8]/80 mt-1">
                        {completedCount} of {tasks.length} parameters ready
                      </span>
                    </div>

                    {/* Circular SVG Gauge */}
                    <div className="relative h-14 w-14 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          className="stroke-white/5 fill-none"
                          strokeWidth="4.5"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          className="stroke-primary fill-none transition-all duration-500"
                          strokeWidth="4.5"
                          strokeDasharray={138.2}
                          strokeDashoffset={138.2 - (138.2 * completionPercent) / 100}
                        />
                      </svg>
                      <span className="absolute text-[8px] font-bold text-primary font-mono">
                        {completedCount}/{tasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Active Services List */}
                  <div className="space-y-2">
                    <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold font-mono">
                      Active Telemetry Nodes
                    </span>

                    {/* Service Node 1 */}
                    <div className="p-3 bg-[#0d0d12]/60 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                          <Database className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white block">SQLite Storage</span>
                          <span className="text-[7.5px] text-[#94a3b8]/75 font-mono">Local Staging Layer</span>
                        </div>
                      </div>
                      <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                        ONLINE
                      </span>
                    </div>

                    {/* Service Node 2 */}
                    <div className="p-3 bg-[#0d0d12]/60 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary border border-primary/20">
                          <Settings className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white block">REST HTTP Server</span>
                          <span className="text-[7.5px] text-[#94a3b8]/75 font-mono">Express Port 4000</span>
                        </div>
                      </div>
                      <span className="text-[8px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-mono">
                        STANDBY
                      </span>
                    </div>

                    {/* Service Node 3 */}
                    <div className="p-3 bg-[#0d0d12]/60 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg border ${syncCloud ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                          <CloudLightning className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white block">Cloud Backup Sync</span>
                          <span className="text-[7.5px] text-[#94a3b8]/75 font-mono">AWS EC2 Serverless</span>
                        </div>
                      </div>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-mono ${syncCloud ? 'bg-indigo-500/15 text-indigo-400' : 'bg-white/10 text-white/40'}`}>
                        {syncCloud ? 'ACTIVE' : 'IDLE'}
                      </span>
                    </div>
                  </div>

                  {/* Network Graph Blueprint Mock */}
                  <div className="glass-panel p-3 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] uppercase tracking-wider text-[#94a3b8]/60 font-bold">API latency (Last 60s)</span>
                      <span className="text-[7.5px] text-primary font-mono">avg 24.5ms</span>
                    </div>
                    {/* SVG Line chart */}
                    <svg className="w-full h-10 stroke-primary fill-none" viewBox="0 0 100 20">
                      <path d="M 0,15 Q 15,18 30,8 T 60,12 T 90,4 T 100,10" strokeWidth="1.2" />
                      {/* Grid support lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeOpacity="0.05" strokeDasharray="2" strokeWidth="0.8" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Deployment Tasks</h4>
                    <p className="text-[9px] text-[#94a3b8]">Tap items to update system variables</p>
                  </div>

                  <div className="space-y-2">
                    {tasks.map(task => (
                      <div 
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                          task.completed 
                            ? 'bg-primary/5 border-primary/30 text-white' 
                            : 'bg-[#0d0d12]/50 border-white/5 text-[#94a3b8] hover:border-white/10'
                        }`}
                      >
                        <span className="text-[9px] font-mono leading-tight max-w-[85%]">{task.title}</span>
                        <div className={`h-4.5 w-4.5 rounded flex items-center justify-center border transition-all ${
                          task.completed 
                            ? 'bg-primary border-primary text-black' 
                            : 'border-white/20 bg-black/40'
                        }`}>
                          {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/15 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-none" />
                    <div>
                      <span className="text-[9.5px] font-bold text-red-300 block">Critical System Core Alert</span>
                      <span className="text-[7.5px] text-red-200/70 block leading-tight mt-0.5">
                        Unity physics module requires adjustment of wind vector sliders on main terminal dashboard to fully resolve.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Device Config</h4>
                    <p className="text-[9px] text-[#94a3b8]">Staging environment properties</p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {/* Toggle 1 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9.5px] text-white font-bold block">AWS Auto-Sync</span>
                        <span className="text-[8px] text-[#94a3b8]/70 block">Sync logs automatically to AWS EC2</span>
                      </div>
                      <button 
                        onClick={() => {
                          soundManager.playTick()
                          setSyncCloud(!syncCloud)
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${syncCloud ? 'bg-primary' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-black rounded-full transition-transform duration-300 transform ${syncCloud ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Toggle 2 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9.5px] text-white font-bold block">Debug Print Mode</span>
                        <span className="text-[8px] text-[#94a3b8]/70 block">Display compiler stdout stream</span>
                      </div>
                      <button 
                        onClick={() => {
                          soundManager.playTick()
                          setDebugLogs(!debugLogs)
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${debugLogs ? 'bg-primary' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-black rounded-full transition-transform duration-300 transform ${debugLogs ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Toggle 3 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9.5px] text-white font-bold block">SQLite Offline DB</span>
                        <span className="text-[8px] text-[#94a3b8]/70 block">Bypass external network endpoints</span>
                      </div>
                      <button 
                        onClick={() => {
                          soundManager.playTick()
                          setOfflineMode(!offlineMode)
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${offlineMode ? 'bg-primary' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-black rounded-full transition-transform duration-300 transform ${offlineMode ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/5 pt-3 text-center">
                    <span className="text-[8px] font-mono text-[#94a3b8]/50 block">Device UUID:</span>
                    <span className="text-[8px] font-mono text-primary block mt-0.5">8A7F-99BC-0D4A-FF37</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Bar / Bottom Buttons */}
          <div className="h-16 border-t border-white/5 bg-[#0d0d12]/95 backdrop-blur-md px-6 flex justify-between items-center z-20">
            {/* Dashboard Navigation button */}
            <button 
              onClick={() => handleTabClick('dashboard')}
              className={`flex flex-col items-center justify-center transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-white/40 hover:text-white/70'}`}
            >
              <Home className="h-4 w-4" />
              <span className="text-[7.5px] mt-1 uppercase tracking-wider font-mono">Overview</span>
            </button>

            {/* Tasks Navigation button */}
            <button 
              onClick={() => handleTabClick('tasks')}
              className={`flex flex-col items-center justify-center transition-colors relative ${activeTab === 'tasks' ? 'text-primary' : 'text-white/40 hover:text-white/70'}`}
            >
              <CheckSquare className="h-4 w-4" />
              <span className="text-[7.5px] mt-1 uppercase tracking-wider font-mono">Tasks</span>
              {completedCount < tasks.length && (
                <div className="absolute top-0 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Settings Navigation button */}
            <button 
              onClick={() => handleTabClick('settings')}
              className={`flex flex-col items-center justify-center transition-colors ${activeTab === 'settings' ? 'text-primary' : 'text-white/40 hover:text-white/70'}`}
            >
              <Settings className="h-4 w-4" />
              <span className="text-[7.5px] mt-1 uppercase tracking-wider font-mono">Config</span>
            </button>
          </div>

          {/* iOS Bottom Swipe Bar */}
          <div className="h-4 flex items-center justify-center pb-1">
            <div className="w-24 h-1 bg-white/20 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  )
}

