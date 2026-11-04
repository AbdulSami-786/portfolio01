import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/site'

/** Intro splash — counts to 100 with a film-leader feel, then lifts away. */
export default function Loader({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const dur = 1900
    let raf
    const tick = (t) => {
      const k = Math.min((t - start) / dur, 1)
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100))
      if (k < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="relative mb-8 flex h-44 w-44 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1.5" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#g)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={289}
            strokeDashoffset={289 - (289 * n) / 100}
          />
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-display text-5xl font-bold tabular-nums">{n}</span>
      </div>
      <motion.p
        className="font-script text-5xl text-blush"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        {site.name}
      </motion.p>
      <p className="mt-3 font-mono text-xs tracking-[0.35em] text-white/40 uppercase">Loading showreel</p>
    </motion.div>
  )
}
