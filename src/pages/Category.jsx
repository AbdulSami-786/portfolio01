import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon, Reveal } from '../components/ui'
import { scrollToId } from '../lib/scroll'
import { BannerCard, DesignCard, ThumbCard, VideoCard } from '../components/WorkCards'
import ProcessSteps from '../components/ProcessSteps'
import Contact from '../components/Contact'
import { categories, countItems } from '../data/site'

function Group({ group, showTitle }) {
  const { kind, items } = group
  return (
    <div id={group.id} className="mb-16 scroll-mt-28 last:mb-0">
      {showTitle && (
        <Reveal>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white/10 pb-4">
            <h2 className="font-display text-2xl font-bold">{group.title}</h2>
            {group.note && <p className="text-sm text-white/45">{group.note}</p>}
          </div>
        </Reveal>
      )}

      {kind === 'video' && items.length === 1 && (
        <Reveal>
          <VideoCard p={items[0]} large />
        </Reveal>
      )}

      {kind === 'video' && items.length > 1 && (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <VideoCard p={p} />
            </Reveal>
          ))}
        </div>
      )}

      {kind === 'thumb' && (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.src} delay={(i % 3) * 0.08}>
              <ThumbCard t={t} />
            </Reveal>
          ))}
        </div>
      )}

      {kind === 'banner' && (
        <div className="grid gap-10">
          {items.map((b) => (
            <Reveal key={b.src}>
              <BannerCard b={b} />
            </Reveal>
          ))}
        </div>
      )}

      {kind === 'design' && (
        <div className={`columns-1 gap-6 sm:columns-2 ${group.cols === 3 ? 'lg:columns-3' : ''}`}>
          {items.map((d) => (
            <Reveal key={d.src} y={20} className="mb-6 break-inside-avoid">
              <DesignCard d={d} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Category() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return <Navigate to="/" replace />

  const n = countItems(category)
  const others = categories.filter((c) => c.slug !== slug)

  return (
    <motion.div key={category.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* header */}
      <section className="px-5 pt-36 pb-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/45">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link to="/" state={{ scrollTo: 'work' }} className="transition-colors hover:text-white">
              Work
            </Link>
            <span>/</span>
            <span className="text-white/80">{category.title}</span>
          </nav>

          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {category.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{category.description}</p>
          <p className="mt-6 font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
            {n} {n === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </section>

      {/* work */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {category.groups.length > 4 && (
            <Reveal>
              <ul className="mb-14 flex flex-wrap gap-2" aria-label="Jump to a section">
                {category.groups.map((g) => (
                  <li key={g.id}>
                    <button
                      onClick={() => scrollToId(g.id)}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
                    >
                      {g.title}
                      <span className="ml-2 font-mono text-xs text-white/35">{g.items.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {category.groups.map((g, i) => (
            <Group key={i} group={g} showTitle={category.groups.length > 1} />
          ))}
        </div>
      </section>

      <ProcessSteps category={category} />

      {/* other categories */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">More work</h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.06} y={20}>
                <Link
                  to={`/${c.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <div>
                    <p className="font-display text-lg font-bold">{c.title}</p>
                    <p className="mt-1 text-sm text-white/45">{c.short}</p>
                  </div>
                  <Icon name="arrow" className="h-5 w-5 shrink-0 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-rose" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Contact defaultType={category.title} clean />
    </motion.div>
  )
}
