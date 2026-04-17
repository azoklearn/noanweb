import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['Design', 'Créer', 'Inspirer']

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const onCompleteRef = useRef(onComplete)
  const completedRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Counter animation
  useEffect(() => {
    const duration = 2700
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(p)

      if (p < 100) {
        requestAnimationFrame(tick)
      } else {
        if (!completedRef.current) {
          completedRef.current = true
          setTimeout(() => onCompleteRef.current(), 400)
        }
      }
    }

    requestAnimationFrame(tick)
  }, [])

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => {
        if (i < WORDS.length - 1) return i + 1
        clearInterval(interval)
        return i
      })
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: '#000000' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Top-left label */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span
          className="text-xs md:text-sm uppercase tracking-[0.3em]"
          style={{ color: 'rgba(225, 224, 204, 0.5)' }}
        >
          Noanweb
        </span>
      </motion.div>

      {/* Center word */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="font-serif italic"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: 'rgba(225, 224, 204, 0.8)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 font-serif tabular-nums leading-none"
        style={{
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: '#E1E0CC',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {Math.round(progress).toString().padStart(3, '0')}
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: 'rgba(31,31,31,0.5)' }}>
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #DEDBC8 0%, #a8a48e 100%)',
            boxShadow: '0 0 8px rgba(222, 219, 200, 0.35)',
            scaleX: progress / 100,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}
