import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const motionEase = [0.16, 1, 0.3, 1] as const

type WordsPullUpProps = {
  text: string
  className?: string
  showAsterisk?: boolean
}

export function WordsPullUp({ text, className = '', showAsterisk = false }: WordsPullUpProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(containerRef, { once: true, margin: '0px 0px -10% 0px' })
  const words = text.split(' ')

  return (
    <div ref={containerRef} className={`flex flex-wrap items-end ${className}`}>
      {words.map((word, index) => {
        const isFinalWord = index === words.length - 1
        const endsWithA = isFinalWord && word.toLowerCase().endsWith('a')

        return (
          <motion.span
            key={`${word}-${index}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: motionEase,
              delay: index * 0.08,
            }}
            className="relative inline-flex items-end"
          >
            <span>{word}</span>
            {showAsterisk && endsWithA ? (
              <sup className="absolute -right-[0.3em] top-[0.65em] text-[0.31em] leading-none">*</sup>
            ) : null}
            {index < words.length - 1 ? <span>&nbsp;</span> : null}
          </motion.span>
        )
      })}
    </div>
  )
}

export default WordsPullUp

