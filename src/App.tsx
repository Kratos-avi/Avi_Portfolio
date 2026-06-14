import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { StartupLoader } from './components/common/StartupLoader'
import { CustomCursor } from './components/common/CustomCursor'
import { soundManager } from './utils/SoundManager'

// Core 3D Background
import { ThreeDWebGLBackground } from './components/webgl/ThreeDWebGLBackground'
import { Scrollbar } from './components/common/Scrollbar'

// Modular Sections
import { Header } from './components/sections/Header'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Capabilities } from './components/sections/Capabilities'
import { Sandbox } from './components/sections/Sandbox'
import { Experience } from './components/sections/Experience'
import { Projects } from './components/sections/Projects'
import { ResumeSection } from './components/sections/ResumeSection'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'

import './App.css'

const navItems = [
  { label: 'Core Identity', href: '#hero' },
  { label: 'Trajectory', href: '#experience' },
  { label: 'Gravity Pull', href: '#projects' },
  { label: 'Quantum Matrix', href: '#sandbox' },
  { label: 'Event Horizon', href: '#contact' },
]

function App() {
  // Global physics states for WebGL background & sandbox control
  const [gravity, setGravity] = useState(0.15)
  const [speed, setSpeed] = useState(1.0)
  const [density, setDensity] = useState(1.0)
  const [theme, setTheme] = useState('cyan')
  const [wireframe, setWireframe] = useState(true)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'cyan') {
      root.style.setProperty('--primary', '#22d3ee')
      root.style.setProperty('--primary-glow', 'rgba(34, 211, 238, 0.18)')
      root.style.setProperty('--accent-glow', 'rgba(168, 85, 247, 0.12)')
      root.style.setProperty('--border-hover', 'rgba(34, 211, 238, 0.35)')
    } else if (theme === 'matrix') {
      root.style.setProperty('--primary', '#34d399')
      root.style.setProperty('--primary-glow', 'rgba(52, 211, 153, 0.18)')
      root.style.setProperty('--accent-glow', 'rgba(59, 130, 246, 0.12)')
      root.style.setProperty('--border-hover', 'rgba(52, 211, 153, 0.35)')
    } else if (theme === 'crimson') {
      root.style.setProperty('--primary', '#ef4444')
      root.style.setProperty('--primary-glow', 'rgba(239, 68, 68, 0.18)')
      root.style.setProperty('--accent-glow', 'rgba(249, 115, 22, 0.12)')
      root.style.setProperty('--border-hover', 'rgba(239, 68, 68, 0.35)')
    } else if (theme === 'gold') {
      root.style.setProperty('--primary', '#d4af37')
      root.style.setProperty('--primary-glow', 'rgba(212, 175, 55, 0.18)')
      root.style.setProperty('--accent-glow', 'rgba(239, 68, 68, 0.12)')
      root.style.setProperty('--border-hover', 'rgba(212, 175, 55, 0.35)')
    }
  }, [theme])

  const [flipped, setFlipped] = useState(false)
  const [booted, setBooted] = useState(false)
  const [ambientVolume, setAmbientVolume] = useState(0.5)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')

  const scrollContainerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current
      let scrollY = window.scrollY
      let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      
      if (scrollContainer) {
        scrollY = scrollContainer.scrollTop
        maxScroll = Math.max(1, scrollContainer.scrollHeight - scrollContainer.clientHeight)
      }
      
      setScrollPercentage(scrollY / maxScroll)

      // Active section tracking
      const sections = document.querySelectorAll('.scroll-section')
      let currentSectionId = 'hero'
      let minDistance = Infinity

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const distance = Math.abs(rect.top)
        if (distance < minDistance) {
          minDistance = distance
          currentSectionId = section.id
        }
      })

      setActiveSection(currentSectionId)
    }

    // Capture scrolling inside container as well
    window.addEventListener('scroll', handleScroll, true)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [booted])

  useEffect(() => {
    if (booted) {
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        scrollContainer.scrollTop = 0
      } else {
        window.scrollTo(0, 0)
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    } else {
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        scrollContainer.scrollTop = 0
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [booted])

  const handleSectionScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    const container = scrollContainerRef.current
    if (element) {
      if (container && window.innerWidth >= 768 && window.innerHeight >= 600) {
        const elementOffsetTop = element.offsetTop
        container.scrollTo({
          top: elementOffsetTop,
          behavior: 'smooth'
        })
      } else {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        e.preventDefault()
        const targetId = anchor.hash.slice(1)
        handleSectionScroll(targetId)
      }
    }
    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol)
    soundManager.setDroneVolume(vol)
  }
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Simulated Telemetry logs in Hero Section
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'SYS: STAGING SYSTEM TELEMETRY DOCK...',
    'NET: AUDITING TCP HANDSHAKES (PORT 443 OK)...',
    'IAM: ENFORCING AWS SECURITY POLICIES...'
  ])
  const [cpuLoad, setCpuLoad] = useState(24)
  const [pingTime, setPingTime] = useState(12)

  useEffect(() => {
    const interval = setInterval(() => {
      // Periodic logs simulator
      const actions = [
        'MEM: STAGING CLIENT BUFFER MAPS...',
        'SYS: SCANNING OS SYSTEM DIRECTORIES...',
        'NET: ROUTER AUDIT PASSED [0 LOSS]',
        'IAM: AWS LAMBDA INSTANCE REALLOCATED...',
        'SYS: SYNCHRONIZING CLOUD TELEMETRY...',
        'NET: SECURE FIREWALL RULES APPLIED...'
      ]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      setTelemetryLogs((prev) => [randomAction, prev[0], prev[1]])
      setCpuLoad(Math.floor(Math.random() * 32) + 12)
      setPingTime(Math.floor(Math.random() * 8) + 8)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    soundManager.playSuccess()
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
      setFlipped(false)
    }, 2500)
  }

  const handleInteraction = () => {
    soundManager.playTick()
  }

  return (
    <>
      {/* 1. Viewport Custom spring follower cursor */}
      <CustomCursor />

      {/* 2. Systems Terminal Bootloader Screen */}
      <AnimatePresence>
        {!booted && (
          <StartupLoader onComplete={() => setBooted(true)} />
        )}
      </AnimatePresence>

      <main ref={scrollContainerRef} className="scroll-container relative min-h-screen bg-[#070709] text-[#f8fafc] overflow-x-hidden">
        {/* 3D Dynamic WebGL Morphing Background Mesh */}
        <ThreeDWebGLBackground 
          gravity={gravity} 
          speed={speed} 
          theme={theme} 
          density={density} 
          wireframe={wireframe} 
          glitch={glitch} 
        />

        {/* Twinkling CSS Starfield layers */}
        <div className="css-stars-layer css-stars-1 pointer-events-none" />
        <div className="css-stars-layer css-stars-2 pointer-events-none" />
        <div className="css-stars-layer css-stars-3 pointer-events-none" />

        {/* Animated Shooting Star overlay */}
        <div className="shooting-stars-overlay pointer-events-none">
          <div className="shooting-star" style={{ top: '15%', left: '20%', animationDelay: '2s' }} />
          <div className="shooting-star" style={{ top: '45%', left: '60%', animationDelay: '8s' }} />
          <div className="shooting-star" style={{ top: '70%', left: '10%', animationDelay: '14s' }} />
          <div className="shooting-star" style={{ top: '85%', left: '50%', animationDelay: '22s' }} />
        </div>

        {/* Background drifting nebulas inside main to prevent clipping */}
        <div className="nebula-glow nebula-primary -top-[10%] -left-[10%] z-[1]" />
        <div className="nebula-glow nebula-accent -bottom-[10%] -right-[10%] z-[1]" />
        <div className="nebula-glow nebula-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]" />

        {/* Floating Noise Overlay */}
        <div className="noise-overlay absolute inset-0 z-[1] pointer-events-none opacity-[0.22] mix-blend-overlay" />

        {/* Top Scroll Indicator Line */}
        <div 
          className="fixed top-0 left-0 h-[2.5px] bg-primary z-50 transition-all duration-75"
          style={{ width: `${scrollPercentage * 100}%`, boxShadow: '0 0 8px var(--primary)' }}
        />

        {/* Fixed Telemetry Margin HUD */}
        <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-6 font-mono text-[9px] text-[#94a3b8]/35 pointer-events-none select-none tracking-widest uppercase">
          <div className="flex flex-col gap-1 border-l border-primary/25 pl-3">
            <span className="text-primary/65 font-bold tracking-wider mb-0.5">COORDS MONITOR</span>
            <span>VECTOR: {scrollPercentage.toFixed(4)}</span>
            <span>ORBIT RAD: {(260.0 - scrollPercentage * 130.0).toFixed(1)} LY</span>
            <span>SPIN VEL: {(speed * 0.05).toFixed(3)} RAD/S</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-primary/25 pl-3">
            <span className="text-primary/65 font-bold tracking-wider mb-0.5">WebGL MATRIX</span>
            <span>STAR COUNT: {(density * 12000).toFixed(0)} PARTICLES</span>
            <span>G-LENS FACTOR: ${(1.0 + gravity * 1.5).toFixed(2)}</span>
            <span>GLSL SHADER: log spiral</span>
          </div>
        </div>

        {/* Fixed Legal/Credits Side HUD */}
        <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-6 font-mono text-[9px] text-[#94a3b8]/35 pointer-events-none select-none tracking-widest uppercase text-right">
          <div className="flex flex-col items-end gap-1 border-r border-primary/25 pr-3">
            <span className="text-primary/65 font-bold tracking-wider mb-0.5">SYS STATUS</span>
            <span>MEM CHECK: OK</span>
            <span>SYSTEM ENGINES: VERIFIED</span>
            <span>SECTOR: {[
              scrollPercentage < 0.14 ? 'CORE IDENTITY' :
              scrollPercentage < 0.42 ? 'COSMIC TRAJECTORY' :
              scrollPercentage < 0.56 ? 'GRAVITY PULL' :
              scrollPercentage < 0.70 ? 'QUANTUM MATRIX' : 'EVENT HORIZON'
            ]}</span>
          </div>
        </div>

        {/* Floating Sidebar Navigation Scrollbar */}
        <Scrollbar activeSection={activeSection} onSectionClick={handleSectionScroll} />

        {/* Header / Nav */}
        <Header 
          navItems={navItems}
          ambientVolume={ambientVolume}
          handleVolumeChange={handleVolumeChange}
          handleInteraction={handleInteraction}
        />

        {/* Hero Section */}
        <Hero 
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
          cpuLoad={cpuLoad}
          pingTime={pingTime}
          telemetryLogs={telemetryLogs}
          handleInteraction={handleInteraction}
        />

        {/* About Section */}
        <About />

        {/* Capabilities Section */}
        <Capabilities />

        {/* Experience Section */}
        <Experience />

        {/* Projects Section */}
        <Projects />

        {/* Sandbox Section */}
        <Sandbox />

        {/* Resume Section */}
        <ResumeSection />

        {/* Contact Section */}
        <Contact 
          flipped={flipped}
          setFlipped={setFlipped}
          formData={formData}
          formSubmitted={formSubmitted}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}

export default App

