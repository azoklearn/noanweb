import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedLetter from './AnimatedLetter'

const BODY_TEXT =
  'De la vitrine au e-commerce, du design à la stratégie : une offre complète pour faire grandir votre business.'

function LineReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="overflow-hidden pb-[0.15em]">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const chars = BODY_TEXT.split('')

  return (
    <section ref={sectionRef} className="bg-black py-24 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#101010] rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 text-center">

          {/* Label */}
          <LineReveal delay={0}>
            <p className="text-primary text-[10px] sm:text-xs mb-8 tracking-widest uppercase">
              Web Design
            </p>
          </LineReveal>

          {/* Heading */}
          <div className="max-w-4xl mx-auto mb-10 md:mb-14 space-y-1">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-primary leading-[1] tracking-tight">
              <LineReveal delay={0.05}>
                <span>Je suis Noan,</span>
              </LineReveal>
              <LineReveal delay={0.13}>
                <span className="font-serif italic">web designer autodidacte.</span>
              </LineReveal>
            </div>

            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-primary/70 leading-[1.1] tracking-tight pt-3">
              <LineReveal delay={0.21}>
                <span>Nous ne livrons pas des sites.</span>
              </LineReveal>
              <LineReveal delay={0.29}>
                <span>Nous construisons des outils de croissance</span>
              </LineReveal>
              <LineReveal delay={0.37}>
                <span>qui reflètent votre ambition</span>
              </LineReveal>
              <LineReveal delay={0.45}>
                <span>et convertissent votre audience.</span>
              </LineReveal>
            </div>
          </div>

          {/* Scroll-animated body text */}
          <motion.p
            className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#DEDBC8' }}
          >
            {chars.map((char, i) => (
              <AnimatedLetter
                key={i}
                char={char}
                index={i}
                total={chars.length}
                containerRef={sectionRef as React.RefObject<HTMLElement>}
              />
            ))}
          </motion.p>

        </div>
      </div>
    </section>
  )
}
