import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Segment {
  text: string
  className?: string
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[]
  containerClassName?: string
  delay?: number
}

export default function WordsPullUpMultiStyle({
  segments,
  containerClassName = '',
  delay = 0,
}: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const allWords: { word: string; className: string; globalIndex: number }[] = []
  let globalIndex = 0

  segments.forEach((seg) => {
    const words = seg.text.split(' ').filter(Boolean)
    words.forEach((word) => {
      allWords.push({ word, className: seg.className || '', globalIndex })
      globalIndex++
    })
  })

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${containerClassName}`}>
      {allWords.map(({ word, className, globalIndex: gi }, i) => (
        <span key={i} className="overflow-hidden inline-flex">
          <motion.span
            className={`inline-block ${className}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + gi * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < allWords.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
