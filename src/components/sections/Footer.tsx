import { Mail, Phone, ExternalLink } from 'lucide-react'
import { ShortcutLink } from '../common/ShortcutLink'
import { ResumeDownloadLink } from '../common/ResumeDownloadLink'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/60 px-4 py-8 md:px-8 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Avinash Suhagiya</p>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#94a3b8]/70 leading-relaxed">
            Systems engineer, hardware support technician, C# game logics programmer, and full-stack developer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ShortcutLink href="mailto:avisuhagiya007@gmail.com" label="Email" icon={<Mail className="h-4 w-4" />} />
          <ShortcutLink href="tel:+12266068863" label="Call" icon={<Phone className="h-4 w-4" />} />
          <ShortcutLink href="https://github.com/Kratos-avi" label="GitHub" icon={<ExternalLink className="h-4 w-4" />} external />
          <ShortcutLink href="https://www.linkedin.com/in/avinashsuhagiya007" label="LinkedIn" icon={<ExternalLink className="h-4 w-4" />} external />
          <ResumeDownloadLink
            label="Resume"
            compact
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101012] px-4 py-2 text-xs text-[#f8fafc] hover:border-primary/35 hover:text-primary transition-all"
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl text-center border-t border-white/5 pt-6 mt-6">
        <p className="text-[10px] text-[#94a3b8]/40 uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} Avinash Suhagiya. Staged for pure performance.
        </p>
      </div>
    </footer>
  )
}

export default Footer

