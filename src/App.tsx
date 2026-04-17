import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Contact from './components/Contact'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <main
        className="bg-black min-h-screen"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        <Hero />
        <section id="about"><About /></section>
        <section id="features"><Features /></section>
        <Contact />
      </main>
    </>
  )
}
