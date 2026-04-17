import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import WordsPullUp from './WordsPullUp'

interface ProjectCardProps {
  index: number
  children: React.ReactNode
  className?: string
}

function ProjectCard({ index, children, className = '' }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}

const CARD_ITEMS = [
  {
    title: 'Machiavelli.',
    number: '01',
    href: 'https://www.machiavelliwatches.com/',
    icon: 'https://noanweb.com/_next/image?url=%2Flogowatch.jpg&w=384&q=75&dpl=dpl_AukVukEuatrA2zkiT5r5z64KtRqD',
    items: [
      'Design élégant et minimaliste',
      'E-commerce haute performance',
      'UX centrée sur la conversion',
      'Identité visuelle premium',
    ],
  },
  {
    title: 'BlaBlaRun Club.',
    number: '02',
    href: 'https://blablarunclubnancy.netlify.app/',
    icon: 'https://noanweb.com/_next/image?url=%2Fblablarun.png&w=384&q=75&dpl=dpl_AukVukEuatrA2zkiT5r5z64KtRqD',
    items: [
      'Site du club de course à pied de Nancy',
      'Footing ouvert à tous chaque mardi place Stanislas',
      'Trois groupes d\'allure : Cool, Intermédiaire, Rapide',
    ],
  },
  {
    title: 'Horeva.',
    number: '03',
    href: 'https://www.montrehoreva.fr/',
    icon: 'https://noanweb.com/_next/image?url=%2Fhoreva.jpeg&w=384&q=75&dpl=dpl_AukVukEuatrA2zkiT5r5z64KtRqD',
    items: [
      'Site e-commerce premium pour la vente de montres de luxe de seconde main',
      'Catalogue de pièces authentifiées, design élégant et moderne',
      'Expérience d\'achat sécurisée pour les collectionneurs et amateurs de montres haut de gamme',
    ],
  },
]

export default function Features() {
  return (
    <section className="min-h-screen bg-black py-24 md:py-32 px-4 md:px-6 relative overflow-hidden">
      {/* Noise background */}
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-primary leading-[0.95] tracking-tight mb-4">
            <WordsPullUp text="Réalisations" delay={0} />
          </h2>
          <motion.p
            className="text-gray-500 text-sm sm:text-base md:text-lg font-normal leading-relaxed"
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Découvrez les projets que nous avons conçus et développés pour nos clients.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {/* Card 1 — Video */}
          <ProjectCard index={0} className="relative h-64 md:h-auto">
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-sm font-medium" style={{ color: '#E1E0CC' }}>
                Votre vision, notre métier.
              </p>
            </div>
          </ProjectCard>

          {/* Cards 2, 3, 4 */}
          {CARD_ITEMS.map((card, i) => (
            <ProjectCard
              key={card.number}
              index={i + 1}
              className="bg-[#212121] flex flex-col justify-between p-5 sm:p-6"
            >
              {/* Top */}
              <div>
                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover mb-4"
                />
                <div className="flex items-baseline gap-2 mb-5">
                  <h3 className="text-primary font-medium text-base sm:text-lg leading-tight">
                    {card.title}
                  </h3>
                  <span className="text-gray-500 text-xs">{card.number}</span>
                </div>

                {/* Checklist */}
                <ul className="space-y-2.5">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-xs leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom link */}
              <div className="mt-6">
                {card.href ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-xs hover:gap-2.5 transition-all duration-200"
                  >
                    <span>Voir le site</span>
                    <ArrowRight size={13} style={{ transform: 'rotate(-45deg)' }} />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-primary/30 text-xs cursor-not-allowed">
                    <span>Bientôt disponible</span>
                  </span>
                )}
              </div>
            </ProjectCard>
          ))}
        </div>
      </div>
    </section>
  )
}
