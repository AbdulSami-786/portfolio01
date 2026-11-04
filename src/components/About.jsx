import { Reveal, SectionHeading, TiltCard } from './ui'
import { site, tools } from '../data/site'

export default function About() {
  return (
    <section id="about" className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index={2}
          eyebrow="About"
          title="About"
          accent="me."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <TiltCard max={6} className="rounded-3xl">
              <div className="rounded-3xl bg-linear-to-br from-violet/60 via-transparent to-rose/60 p-px">
                <img
                  src="/media/img/banner.png"
                  alt={`${site.name} — Video Editor, Graphic Designer, 3D Motion Graphic`}
                  className="w-full rounded-[calc(1.5rem-1px)]"
                  loading="lazy"
                />
              </div>
            </TiltCard>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-2xl leading-snug font-medium text-white/90 sm:text-3xl">
                Video editor, graphic designer and 3D motion artist{' '}
                <span className="text-gradient">working with creators and brands.</span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                I'm {site.name}, a freelance creative. My work covers ads and promo edits, long-form YouTube videos, 2D
                animation, voice-over narration, and thumbnail and banner design. I focus on pacing, clarity and clean
                visuals, so your content is easy to follow and looks professional.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/60">
                Browse the work categories above to see examples from each area, or send me a message about your
                project.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-10 mb-4 font-mono text-xs tracking-[0.25em] text-white/40 uppercase">Tools I use</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tools.map((t) => (
                  <div
                    key={t.code}
                    className="glass group rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <div
                      className={`mb-3 grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${t.hue} transition-transform duration-500 group-hover:rotate-[360deg]`}
                    >
                      <span className={`font-display text-lg font-bold ${t.text}`}>{t.code}</span>
                    </div>
                    <p className="text-sm font-semibold">{t.name}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-10 font-hand text-3xl text-rose">
                {site.mantra.join(' · ')} <span className="text-blush">♥</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
