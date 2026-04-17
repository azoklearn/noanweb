import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Mail, Calendar } from 'lucide-react'

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

export default function Contact() {
  return (
    <section id="inquiries" className="bg-black py-24 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — heading */}
          <div>
            <LineReveal delay={0}>
              <p className="text-primary text-[10px] sm:text-xs mb-6 tracking-widest uppercase">
                Contact
              </p>
            </LineReveal>

            <div className="text-4xl sm:text-5xl md:text-6xl font-normal text-primary leading-[1] tracking-tight mb-8">
              <LineReveal delay={0.05}>
                <span>Vous avez</span>
              </LineReveal>
              <LineReveal delay={0.13}>
                <span>un projet</span>
              </LineReveal>
              <LineReveal delay={0.21}>
                <span className="font-serif italic">en tête ?</span>
              </LineReveal>
            </div>

            <motion.p
              className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-sm"
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              Réservez un appel de 30 min pour discuter de votre projet, vos objectifs et voir comment on peut travailler ensemble.
            </motion.p>
          </div>

          {/* Right — actions */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Primary CTA */}
            <a
              href="https://cal.com/noanweb/call"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-primary rounded-2xl px-6 py-5 hover:bg-primary/90 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-black" />
                <p className="text-black font-medium text-sm sm:text-base">Réserver un appel</p>
              </div>
              <span className="bg-black rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight size={16} className="text-primary" />
              </span>
            </a>

            {/* Secondary CTA */}
            <a
              href="mailto:barbelinnoan@gmail.com"
              className="group flex items-center justify-between bg-[#101010] rounded-2xl px-6 py-5 hover:bg-[#181818] transition-colors duration-200 border border-white/5"
            >
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-primary/60" />
                <p className="text-primary font-medium text-sm sm:text-base">Envoyer un email</p>
              </div>
              <span className="bg-white/5 rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight size={16} className="text-primary/60" />
              </span>
            </a>

            {/* Footer note */}
            <p className="text-gray-600 text-xs text-center pt-2">
              Réponse sous 24h · Disponible pour des projets en France et à l'international
            </p>
          </motion.div>

        </div>

        {/* Bottom divider + copyright */}
        <motion.div
          className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-gray-600 text-xs">© 2026 noanweb. Tous droits réservés.</p>
          <p className="text-gray-600 text-xs">Conçu & développé par Noan</p>
        </motion.div>

      </div>
    </section>
  )
}
