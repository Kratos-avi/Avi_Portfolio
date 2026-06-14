import { useState } from 'react'
import { motion } from 'framer-motion'
import { soundManager } from '../../utils/SoundManager'
import { ChevronLeft, ChevronRight, Briefcase, Calendar, MapPin } from 'lucide-react'

interface JobData {
  title: string
  company: string
  location: string
  period: string
  description: string
  bullets: string[]
}

const JOBS: JobData[] = [
  {
    company: 'Amazon Fulfillment Center',
    title: 'Warehouse Associate & Floor Diagnostics',
    location: 'Ontario, Canada',
    period: 'Present',
    description: 'Provide operational logistics diagnostics and inventory security support under tight, high-volume shipping timelines.',
    bullets: [
      'Manage inventory database tracking workflows via internal handheld RF scanners.',
      'Troubleshoot floor scanner connectivity dropouts and software logs directly on the floor.',
      'Optimize item routing protocols to maximize picking and packing velocity.'
    ]
  },
  {
    company: 'Conestoga College',
    title: 'Mobile & Web Development Diploma',
    location: 'Ontario, Canada',
    period: 'Completed 2026',
    description: 'Hands-on training covering full-stack architectures, native/cross-platform mobile frameworks, and cloud IaC configurations.',
    bullets: [
      'Advanced Application Architectures: built Flutter and native Kotlin products.',
      'Cloud service configurations: orchestrated automated server stacks with Terraform.',
      'Database admin: implemented MySQL schemas and secure JWT session APIs.'
    ]
  },
  {
    company: 'Dollarama',
    title: 'Store Associate & POS Diagnostics',
    location: 'Ontario, Canada',
    period: '2024 - 2025',
    description: 'Delivered customer assistance, resolved hardware POS glitches, and managed transaction records.',
    bullets: [
      'Managed POS terminals, ensuring zero cash discrepancies and clean cash drawer handoffs.',
      'Staged visual merchandising and inventory restocking spreadsheets to track stock levels.',
      'Resolved client transaction inquiries rapidly under peak commercial hours.'
    ]
  },
  {
    company: 'Choice Indian Restaurant',
    title: 'Line Cook & Inventory Controller',
    location: 'Ontario, Canada',
    period: '2024',
    description: 'Maintained strict safety regulations, rapid preparation, and ingredient cataloging in high-pressure environments.',
    bullets: [
      'Coordinated with server staff to expedite customer order tickets under peak hours.',
      'Maintained kitchen equipment diagnostics and safety protocols.',
      'Managed inventory stock levels to ensure zero prep waste.'
    ]
  },
  {
    company: 'Swaminarayan Aksharpith',
    title: '3D Animation Specialist & Render Admin',
    location: 'Ahmedabad, India',
    period: '1 Year (2023)',
    description: 'Engineered rendering pipelines and animated asset repository files for published media.',
    bullets: [
      'Created 3D character and layout model assets for a major feature film released on YouTube.',
      'Optimized render farms and network caches to decrease frame loading times.',
      'Collaborated within Git-based asset teams to ensure strict naming and folders conventions.'
    ]
  },
  {
    company: 'Swaminarayan Aksharpith',
    title: 'IT & Technical Assistant',
    location: 'Ahmedabad, India',
    period: '2 Years (2021 - 2023)',
    description: 'Staged computer hardware terminals, configured secure routing segments, and audited firewall rules.',
    bullets: [
      'Diagnosed and repaired desktop, laptop, and client peripheral hardware, resolving workstation failures.',
      'Audited network firewall rules to secure corporate and student campus network paths.',
      'Deployed staged operating system images (Windows/Linux) tailored to user segments.',
      'Delivered tiered IT support logs, troubleshooting software glitches efficiently.'
    ]
  }
]

export function ExperienceDeck() {
  const [activeIdx, setActiveIdx] = useState(0)

  const handleNext = () => {
    soundManager.playSuccess()
    setActiveIdx((prev) => (prev + 1) % JOBS.length)
  }

  const handlePrev = () => {
    soundManager.playSuccess()
    setActiveIdx((prev) => (prev - 1 + JOBS.length) % JOBS.length)
  }

  const handleCardClick = (idx: number) => {
    if (idx !== activeIdx) {
      soundManager.playSuccess()
      setActiveIdx(idx)
    }
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 flex flex-col items-center select-none preserve-3d">
      
      {/* 3D Stack Viewport */}
      <div className="relative w-full h-[450px] flex items-center justify-center preserve-3d">
        {JOBS.map((job, idx) => {
          // Calculate relative offsets for 3D card layering
          let offset = idx - activeIdx
          if (offset < -Math.floor(JOBS.length / 2)) offset += JOBS.length
          if (offset > Math.floor(JOBS.length / 2)) offset -= JOBS.length

          const isActive = offset === 0
          const isVisible = Math.abs(offset) <= 1

          // Calculate transforms based on offset
          const translate3d = offset === 0
            ? 'translate3d(0, 0, 0)'
            : offset === 1
            ? 'translate3d(240px, 0, -120px) rotateY(-25deg)'
            : 'translate3d(-240px, 0, -120px) rotateY(25deg)'

          const zIndex = 10 - Math.abs(offset)
          const scale = 1 - Math.abs(offset) * 0.12
          const opacity = isActive ? 1 : isVisible ? 0.65 : 0

          return (
            <motion.div
              key={idx}
              onClick={() => handleCardClick(idx)}
              style={{
                position: 'absolute',
                width: '100%',
                maxWidth: '460px',
                height: '360px',
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              animate={{
                transform: `translate(-50%, -50%) ${translate3d} scale(${scale})`,
                opacity: opacity,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute left-1/2 top-1/2 cursor-pointer"
            >
              <div className={`w-full h-full p-6 sm:p-8 rounded-[2rem] border transition-all duration-500 ${
                isActive
                  ? 'border-primary bg-[#101012]/95 shadow-xl shadow-primary/5'
                  : 'border-white/5 bg-[#101012]/60 hover:border-white/10'
              }`}>
                
                {/* Header info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary/10 border border-primary/30' : 'bg-white/5'}`}>
                      <Briefcase className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-[#94a3b8]'}`} />
                    </div>
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-widest block ${isActive ? 'text-primary' : 'text-[#94a3b8]/70'}`}>
                        {job.company}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 leading-tight">{job.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-[#94a3b8]/60 font-mono border-b border-white/5 pb-3 mb-4 select-text">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary/75" />
                    {job.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary/75" />
                    {job.location}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-4 select-text">{job.description}</p>

                {/* Bullet points */}
                <ul className="space-y-2 text-[10px] text-[#94a3b8]/90 select-text">
                  {job.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-2 items-start">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Left/Right Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full border border-white/10 bg-white/5 text-[#94a3b8] hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-mono text-xs text-[#94a3b8]/60 uppercase tracking-widest select-none">
          Job {activeIdx + 1} of {JOBS.length}
        </span>
        <button
          onClick={handleNext}
          className="p-3 rounded-full border border-white/10 bg-white/5 text-[#94a3b8] hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
export default ExperienceDeck

