import { Check } from 'lucide-react'
import { ThreeDTilt } from './ThreeDTilt'
import { WarpableImagePlane } from '../webgl/WarpableImagePlane'

type FeatureCardProps = {
  title: string
  accent: string
  description: string
  items?: string[]
  media?: {
    type: 'video' | 'image'
    src: string
    label: string
  }
}

export function FeatureCard({ title, accent, description, items, media }: FeatureCardProps) {
  return (
    <ThreeDTilt intensity={12}>
      <div className="holo-card p-4 md:p-5 h-full flex flex-col justify-between min-h-[460px] relative preserve-3d">
        <div>
          {media && (
            <div className="mb-4">
              <WarpableImagePlane
                imageSrc={media.src}
                alt={media.label ?? title}
                accent={accent}
              />
            </div>
          )}

          <div style={{ transform: 'translateZ(30px)' }} className="preserve-3d transition-transform duration-300">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold">{accent}</span>
            <h3 className="mt-2 text-lg font-bold text-[#f8fafc] leading-tight">{title}</h3>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#94a3b8]">
            {description}
          </p>
        </div>

        <div className="mt-4 border-t border-white/5 pt-3">
          <ul className="space-y-2 text-xs text-[#94a3b8]">
            {items?.map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <Check className="h-3.5 w-3.5 text-primary mt-0.5 flex-none" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ThreeDTilt>
  )
}

export default FeatureCard

