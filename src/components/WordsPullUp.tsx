import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WordsPullUpProps {
  text: string
  className?: string
  showAsterisk?: boolean
  delay?: number
}

export default function WordsPullUp({ text, className = '', showAsterisk = false, delay = 0 }: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <span key={i} className="overflow-hidden inline-flex">
            <motion.span
              className="inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {isLast && showAsterisk ? (
                <span className="relative">
                  {word}
                  <sup
                    className="absolute font-normal"
                    style={{
                      top: '0.65em',
                      right: '-0.3em',
                      fontSize: '0.31em',
                    }}
                  >
                    *
                  </sup>
                </span>
              ) : (
                word
              )}
              {i < words.length - 1 && '\u00A0'}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
