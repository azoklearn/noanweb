import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import WordsPullUp from './WordsPullUp'

const NAV_ITEMS = [
  { label: 'Mon histoire', href: '#about' },
  { label: 'Réalisations', href: '#features' },
  { label: 'Contact', href: '#inquiries' },
]

export default function Hero() {
  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        {/* Background video */}
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Noise overlay */}
        <div
          className="noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none"
          style={{ zIndex: 2 }}
        />

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 flex justify-center" style={{ zIndex: 10 }}>
          <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8">
            <nav className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    const target = document.querySelector(item.href)
                    if (target) {
                      e.preventDefault()
                      target.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="text-[10px] sm:text-xs md:text-sm transition-colors duration-200 whitespace-nowrap"
                  style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero content — bottom aligned */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-4 md:pb-6"
          style={{ zIndex: 10 }}
        >
          <div className="grid grid-cols-12 items-end gap-4">
            {/* Heading — 8 cols */}
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] relative"
                style={{
                  fontSize: 'clamp(6rem, 26vw, 20vw)',
                  color: '#E1E0CC',
                  lineHeight: 0.85,
                }}
              >
                <span className="flex flex-col">
                  <WordsPullUp text="Noan. " delay={0.08} />
                  <WordsPullUp text="" showAsterisk delay={0.08} />
                </span>
              </h1>
            </div>

            {/* Right column — 4 cols */}
            <div className="col-span-12 lg:col-span-4 flex flex-col items-start lg:items-end gap-4 pb-1">
              {/* Description */}
              <motion.p
                className="text-primary/70 text-xs sm:text-sm md:text-base max-w-xs text-left lg:text-right"
                style={{ lineHeight: 1.2 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Sites web haut de gamme, design percutant, conversion optimisée.
                <br />
                Nous créons l&apos;outil digital qui fait vendre
              </motion.p>

              {/* CTA Button */}
              <motion.a
                href="https://cal.com/noanweb/call"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-primary rounded-full pl-5 pr-1.5 py-1.5 hover:gap-3 transition-all duration-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-medium text-sm sm:text-base text-black">Démarrer un projet</span>
                <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={16} className="text-primary" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
