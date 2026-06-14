import { MapPin, Phone, Mail } from 'lucide-react'
import { ResumeDownloadLink } from '../common/ResumeDownloadLink'

export function ResumeSection() {
  return (
    <section id="resume" className="scroll-section relative z-10 px-4 py-24 md:px-8 border-t border-white/5 bg-transparent">
      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
              <span className="text-primary/50">//05</span> PDF
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[#f8fafc] mt-2">
              Compile PDF Experience Resume.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-2xl">
              Ready to review? Click to compile your full resume details (AWS configurations, IT repairs, game programming mechanics, Conestoga College competencies). Compiles immediately.
            </p>
          </div>

          <div className="mt-8" data-cursor-text="COMPILE AND DOWNLOAD RESUME">
            <ResumeDownloadLink
              label="Download Full Resume (PDF)"
              compact={false}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02] btn-shimmer"
            />
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-mono">Coordinates Status</span>
            <h3 className="text-xl font-bold mt-2 text-[#f8fafc]">Ontario, Canada</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Open to remote, hybrid, or relocation opportunities across IT diagnostics support, AWS systems operations, or full-stack software development.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 space-y-2 text-xs text-[#94a3b8] font-mono">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Ontario, Canada</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>+1 (226) 606-8863</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>avisuhagiya007@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResumeSection

