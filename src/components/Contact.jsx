import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Reveal } from './ui'
import { scrollState } from '../lib/scroll'
import { analytics, categories, site } from '../data/site'

const types = [...categories.map((c) => c.title), 'Something else']

/** Contact form + footer. `clean` = flat styling for the work pages. */
export default function Contact({ defaultType = types[0], clean = false }) {
  const [form, setForm] = useState({ name: '', email: '', type: defaultType, message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`${form.type} project — ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
  }

  const socials = site.socials.filter((s) => s.href)
  const field =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-white/30 outline-none transition focus:border-orchid focus:bg-white/10 focus:shadow-[0_0_0_4px_rgb(192_132_252/0.15)]'

  return (
    <section id="contact" className={`relative z-10 px-5 pb-16 sm:px-8 lg:px-12 ${clean ? 'border-t border-white/10 pt-20' : 'pt-24'}`}>
      <div className="mx-auto max-w-6xl">
        <div
          className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-14 ${
            clean ? 'border border-white/10 bg-white/[0.03]' : 'glass'
          }`}
        >
          {!clean && (
            <>
              <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-rose/25 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet/30 blur-[100px]" />
            </>
          )}

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <Reveal>
                <p className="font-script text-5xl text-blush">Let's work together</p>
                <h2 className="mt-2 font-display text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl">
                  Have a project in mind?
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                  Tell me what you need, your timeline and any references. I'll read your message and reply by email.
                </p>
              </Reveal>

              <Reveal delay={0.12}>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-8 inline-flex items-center gap-3 text-lg font-semibold text-white hover:text-rose"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-linear-to-br from-violet to-rose text-ink">
                    <Icon name="arrow" className="h-5 w-5 -rotate-45" />
                  </span>
                  {site.email}
                </a>

                {socials.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 transition hover:-translate-y-0.5 hover:text-white"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required className={field} placeholder="Your name" aria-label="Your name" value={form.name} onChange={set('name')} />
                  <input
                    required
                    type="email"
                    className={field}
                    placeholder="Email address"
                    aria-label="Email address"
                    value={form.email}
                    onChange={set('email')}
                  />
                </div>

                <div className="flex flex-wrap gap-2" role="group" aria-label="Project type">
                  {types.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      aria-pressed={form.type === t}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        form.type === t
                          ? 'bg-linear-to-r from-violet to-rose font-semibold text-ink'
                          : 'border border-white/15 text-white/65 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={5}
                  className={`${field} resize-none`}
                  placeholder="Tell me about your project…"
                  aria-label="Project details"
                  value={form.message}
                  onChange={set('message')}
                />
                <Button type="submit" className="w-full sm:w-auto">
                  Send message <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </Reveal>
          </div>
        </div>

        <footer className="mt-14 flex flex-col items-center justify-between gap-6 text-sm text-white/40 lg:flex-row">
          <div className="text-center lg:text-left">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            {analytics.endpoint && (
              <p className="mt-1 text-xs text-white/30">
                This site records visit data (IP address, date, time and pages viewed) for analytics.
              </p>
            )}
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} className="transition-colors hover:text-rose">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={() =>
              scrollState.lenis ? scrollState.lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0 })
            }
            className="rounded-full border border-white/15 px-4 py-2 transition hover:border-rose hover:text-rose"
          >
            Back to top ↑
          </button>
        </footer>
      </div>
    </section>
  )
}
