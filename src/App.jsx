import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { scrollState } from './lib/scroll'
import { ModalContext } from './lib/modal'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Modal from './components/Modal'
import Analytics from './components/Analytics'
import Home from './pages/Home'
import Category from './pages/Category'

// Three.js is heavy — load it in its own chunk so the page paints first.
const Scene3D = lazy(() => import('./components/Scene3D'))

function Layout() {
  const { pathname, state } = useLocation()
  const isHome = pathname === '/'
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // smooth scroll + shared scroll / pointer state for the 3D scene
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    scrollState.lenis = lenis
    lenis.stop()
    lenis.on('scroll', ({ progress }) => (scrollState.progress = progress))

    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e) => {
      scrollState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      lenis.destroy()
      scrollState.lenis = null
    }
  }, [])

  // every page change starts at the top (unless a section was requested)
  useEffect(() => {
    setModal(null)
    scrollState.progress = 0
    if (!state?.scrollTo) scrollState.lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname, state])

  const done = useCallback(() => {
    scrollState.introDone = true
    setLoading(false)
    scrollState.lenis?.start()
  }, [])
  const close = useCallback(() => setModal(null), [])

  return (
    <ModalContext.Provider value={setModal}>
      <div className={isHome ? 'grain relative' : 'relative min-h-screen bg-[#0d0b13]'}>
        <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>

        {/* the 3D scene lives on the home page only — work pages stay clean */}
        {isHome && (
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        )}

        <motion.div
          style={{ scaleX: bar }}
          className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-linear-to-r from-violet via-orchid to-rose"
        />

        <Cursor />
        <Navbar />

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:slug" element={<Category />} />
          </Routes>
        </main>

        <Modal item={modal} onClose={close} />
        <Analytics />
      </div>
    </ModalContext.Provider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  )
}
