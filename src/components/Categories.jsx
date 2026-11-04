import { Link } from 'react-router-dom'
import { Icon, Reveal, SectionHeading } from './ui'
import { categories, countItems } from '../data/site'

/** Home page work section — one box per category, each opening its own page. */
export default function Categories() {
  return (
    <section id="work" className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index={1}
          eyebrow="Work"
          title="Choose a"
          accent="category."
          text="Each category has its own page with the projects and the way I work on them."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {categories.map((c, i) => {
            const n = countItems(c)
            return (
              <Reveal key={c.slug} delay={(i % 3) * 0.08} className={i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <Link
                  to={`/${c.slug}`}
                  data-cursor="Open"
                  className="group relative block h-[300px] overflow-hidden rounded-3xl bg-plum ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-25px_rgb(139_92_246/0.7)] hover:ring-orchid/60 sm:h-[340px]"
                >
                  <img
                    src={c.cover}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/10" />

                  <span className="absolute top-5 left-5 rounded-full bg-ink/70 px-3 py-1 font-mono text-[11px] tracking-wider text-white/90 uppercase backdrop-blur">
                    {n} {n === 1 ? 'project' : 'projects'}
                  </span>
                  <span className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-rose group-hover:text-ink">
                    <Icon name="arrow" className="h-5 w-5" />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl font-bold sm:text-3xl">{c.title}</h3>
                    <p className="mt-2 text-white/65">{c.short}</p>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
