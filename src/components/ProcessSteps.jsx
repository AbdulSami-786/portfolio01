import { Reveal } from './ui'

/** Category-specific workflow + what the client receives. */
export default function ProcessSteps({ category }) {
  return (
    <section className="border-t border-white/10 bg-white/[0.02] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.25em] text-rose uppercase">Process</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">How I work on {category.title.toLowerCase()}</h2>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {category.process.map((s, i) => (
            <li key={s.title} className="bg-[#0d0b13] p-7">
              <Reveal delay={i * 0.08} y={20}>
                <span className="font-mono text-sm text-rose">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="mr-2 text-sm text-white/45">What you receive:</span>
            {category.deliverables.map((d) => (
              <span key={d} className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/75">
                {d}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
