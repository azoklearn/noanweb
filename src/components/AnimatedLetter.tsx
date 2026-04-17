import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AnimatedLetterProps {
  char: string
  index: number
  total: number
  containerRef: React.RefObject<HTMLElement>
}

export default function AnimatedLetter({ char, index, total, containerRef }: AnimatedLetterProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const charProgress = index / total
  const opacity = useTransform(
    scrollYProgress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1]
  )

  if (char === ' ') {
    return <span>&nbsp;</span>
  }

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char}
    </motion.span>
  )
}
