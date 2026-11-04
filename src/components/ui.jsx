import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

/** Fade + rise on scroll. */
export function Reveal({ children, delay = 0, y = 36, className = '', as: Tag = 'div' }) {
  const M = motion[Tag]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/** Section heading with a timecode eyebrow, like a video timeline marker. */
export function SectionHeading({ index, eyebrow, title, accent, text }) {
  return (
    <div className="mb-14 max-w-3xl">
      <Reveal>
        <div className="mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-orchid uppercase">
          <span className="rounded-md border border-orchid/40 bg-orchid/10 px-2 py-1">00:0{index}:00</span>
          <span className="h-px w-10 bg-linear-to-r from-orchid to-transparent" />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title} <span className="text-gradient">{accent}</span>
        </h2>
      </Reveal>
      {text && (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">{text}</p>
        </Reveal>
      )}
    </div>
  )
}

/** 3D tilt that follows the pointer. */
export function TiltCard({ children, className = '', max = 10, glare = true, ...rest }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 18 })
  const glareBg = useTransform(
    [px, py],
    ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.5), transparent 55%)`,
  )

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`group preserve-3d relative ${className}`}
      {...rest}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}

/** Counts up once visible. */
export function CountUp({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0'
  const styles =
    variant === 'primary'
      ? 'bg-linear-to-r from-violet via-orchid to-rose text-ink shadow-[0_10px_40px_-10px_rgb(244_114_182/0.8)]'
      : 'glass text-white hover:bg-white/10'
  return (
    <button className={`${base} ${styles} ${className}`} data-cursor="" {...props}>
      {children}
    </button>
  )
}

const ICONS = {
  clapper: (
    <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm0 0 1.5-4.5 3.8 1L8 8m3-3.5 3.8 1L13.5 8M17 5.5 20.5 6.5 19 8M10 13l5 3-5 3v-6Z" />
  ),
  cube: <path d="m12 2 8.5 4.8v10.4L12 22l-8.5-4.8V6.8L12 2Zm0 9.8 8.5-5M12 11.8v10.2M12 11.8 3.5 6.8" />,
  pen: <path d="m12 3 3 7-3 3-3-3 3-7Zm0 10v3m-5 5h10M9.5 18.5a2.5 2.5 0 1 1 5 0M5 12a7 7 0 0 1 14 0" />,
  mic: <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0m-7 7v3m-3 0h6" />,
  play: <path d="M8 5v14l11-7L8 5Z" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
}

export function Icon({ name, className = 'h-6 w-6', fill = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  )
}
