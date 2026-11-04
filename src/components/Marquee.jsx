import { CountUp, Reveal } from './ui'
import { marquee, stats } from '../data/site'

export function Marquee() {
  const row = [...marquee, ...marquee]
  return (
    <div className="relative z-10 overflow-hidden py-4">
      <div className="-rotate-1 border-y border-white/10 bg-ink/70 py-5 backdrop-blur-sm">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              <span className={i % 2 ? 'text-gradient' : 'text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.45)]'}>
                {t}
              </span>
              <span className="text-rose">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Stats() {
  return (
    <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="glass h-full rounded-3xl p-6 text-center sm:p-8">
              <div className="text-gradient font-display text-5xl font-bold sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm text-white/55">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
