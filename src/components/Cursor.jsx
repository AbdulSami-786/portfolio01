import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Custom glowing cursor — only on devices with a fine pointer. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState({ hover: false, label: '' })
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    document.body.classList.add('has-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor], a, button, input, textarea, label')
      setState(t ? { hover: true, label: t.dataset?.cursor || '' } : { hover: false, label: '' })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99] flex items-center justify-center rounded-full border border-rose/70 text-[11px] font-bold tracking-widest text-ink uppercase"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: state.label ? 92 : state.hover ? 56 : 34,
          height: state.label ? 92 : state.hover ? 56 : 34,
          backgroundColor: state.label ? 'rgb(244 114 182 / 0.95)' : state.hover ? 'rgb(244 114 182 / 0.15)' : 'rgb(244 114 182 / 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {state.label}
      </motion.div>
    </>
  )
}
