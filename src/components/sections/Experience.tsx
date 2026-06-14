import { ExperienceDeck } from '../widgets/ExperienceDeck'

export function Experience() {
  return (
    <section id="experience" className="scroll-section relative z-10 px-4 py-24 md:px-8 border-t border-white/5 bg-transparent">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
            <span className="text-primary/50">//02</span> Logs
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-[#f8fafc] mt-2">Professional Experience</h2>
          <p className="text-sm text-[#94a3b8] mt-3 max-w-lg mx-auto leading-relaxed">
            Detailed breakdown of over 7 years across hardware client support, network firewall security audits, 3D asset pipeline management, and fast-paced operational diagnostics.
          </p>
        </div>

        <div data-cursor-text="DRAG HOLOGRAPHIC JOB CARDS">
          <ExperienceDeck />
        </div>
      </div>
    </section>
  )
}

export default Experience

