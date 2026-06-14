import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, ArrowUpRight } from 'lucide-react'
import { ResumePdf, resumeFileName } from '../pdf/ResumePdf'

type ResumeDownloadLinkProps = {
  label: string
  compact: boolean
  className: string
}

export function ResumeDownloadLink({ label, compact, className }: ResumeDownloadLinkProps) {
  return (
    <PDFDownloadLink
      document={<ResumePdf />}
      fileName={resumeFileName}
      className={className}
      data-magnetic
    >
      {({ loading }) => (
        <>
          <Download className="h-4 w-4" />
          <span className="btn-label-slide">
            <span className="btn-label-slide__inner">
              {loading ? 'Compiling PDF...' : label}
              <span className="btn-label-slide__hover">
                {loading ? 'Compiling PDF...' : label}
              </span>
            </span>
          </span>
          {!compact ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#22d3ee]" />
            </span>
          ) : null}
        </>
      )}
    </PDFDownloadLink>
  )
}

export default ResumeDownloadLink

