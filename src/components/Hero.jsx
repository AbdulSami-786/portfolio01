import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Icon, TiltCard } from './ui'
import { intro, scrollToId } from '../lib/scroll'
import { site, tools } from '../data/site'

const ease = [0.22, 1, 0.36, 1]

function Timecode() {
  const [f, setF] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setF((v) => v + 1), 42)
    return () => clearInterval(id)
  }, [])
  const frames = f % 24
  const secs = Math.floor(f / 24) % 60
  const mins = Math.floor(f / 1440)
  const p = (n) => String(n).padStart(2, '0')
  return <span className="tabular-nums">{`${p(mins)}:${p(secs)}:${p(frames)}`}</span>
}

function RoleRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % site.roles.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-flex h-9 overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="text-gradient font-semibold"
        >
          {site.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const floaters = [
  { t: tools[0], cls: '-top-4 -left-4 sm:-left-10', delay: '0s' },
  { t: tools[1], cls: 'top-24 -right-3 sm:-right-10', delay: '-1.5s' },
  { t: tools[2], cls: 'bottom-28 -left-3 sm:-left-12', delay: '-3s' },
  { t: tools[3], cls: '-bottom-3 right-6 sm:right-0', delay: '-4.5s' },
]

export default function Hero() {
  const words1 = ['Turn', 'Ideas', 'into']
  const words2 = ['Stunning', 'Visuals']

  return (
    <section id="home" className="relative flex min-h-screen items-center px-5 pt-28 pb-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Copy ── */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: intro(2.3), duration: 0.7 }}
            className="glass mb-8 inline-flex items-center gap-3 rounded-full py-2 pr-5 pl-3 text-sm text-white/80"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Available for freelance projects
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: intro(2.4), duration: 0.8, ease }}
            className="font-script text-5xl text-blush sm:text-6xl"
          >
            Hi, I'm {site.name} <span className="text-rose">♥</span>
          </motion.p>

          <h1 className="mt-3 font-display text-[clamp(2.4rem,5.4vw,4.9rem)] leading-[1.02] font-bold tracking-tight">
            <span className="block overflow-hidden pb-1">
              {words1.map((w, i) => (
                <motion.span
                  key={w}
                  className="mr-[0.25em] inline-block"
                  initial={{ y: '110%', rotate: 6 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: intro(2.5) + i * 0.09, duration: 0.9, ease }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden pb-3">
              {words2.map((w, i) => (
                <motion.span
                  key={w}
                  className="text-gradient mr-[0.25em] inline-block"
                  initial={{ y: '110%', rotate: 6 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: intro(2.8) + i * 0.09, duration: 0.9, ease }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: intro(3.1), duration: 0.8, ease }}
          >
            <p className="mt-4 flex flex-wrap items-center gap-x-2 text-2xl text-white/80">
              I'm a freelance <RoleRotator />
            </p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
              I edit videos, create motion graphics and 2D animation, record voice-over, and design thumbnails and
              banners for creators and brands.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button onClick={() => scrollToId('work')}>
                View my work <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="ghost" onClick={() => scrollToId('contact')}>
                Let's talk
              </Button>
            </div>
          </motion.div>
        </div>

        {/* ── Portrait ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: intro(2.5), duration: 1.1, ease }}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          <TiltCard max={9} className="rounded-[2.5rem]">
            <div className="rounded-[2.5rem] bg-linear-to-br from-violet via-orchid to-rose p-[2px] shadow-[0_30px_100px_-20px_rgb(139_92_246/0.7)]">
              <div className="relative overflow-hidden rounded-[calc(2.5rem-2px)] bg-plum">
                <img
                  src="/media/img/maya.png"
                  alt="Illustrated portrait of Maya James at her editing desk"
                  className="aspect-square w-full object-cover"
                  width="1254"
                  height="1254"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-xs backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> REC <Timecode />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="font-script text-3xl text-white">{site.name}</p>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase">
                      {site.mantra.join(' · ')}
                    </p>
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur">
                    <Icon name="play" className="h-5 w-5 translate-x-px" fill />
                  </span>
                </div>
              </div>
            </div>
          </TiltCard>

          {floaters.map(({ t, cls, delay }) => (
            <div
              key={t.code}
              className={`absolute ${cls} animate-float`}
              style={{ animationDelay: delay }}
              title={t.name}
            >
              <div className={`glass grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br ${t.hue} shadow-xl sm:h-16 sm:w-16`}>
                <span className={`font-display text-xl font-bold ${t.text}`}>{t.code}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollToId('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: intro(3.6) }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase lg:flex"
        aria-label="Scroll down"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-rose"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}
