import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { intro, scrollToId } from '../lib/scroll'
import { categories, site } from '../data/site'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the section in view (home page only)
  useEffect(() => {
    setOpen(false)
    setMenu(false)
    if (!isHome) return setActive('')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const t = setTimeout(() => {
      ;['home', 'work', 'about', 'contact'].forEach((id) => {
        const el = document.getElementById(id)
        if (el) io.observe(el)
      })
    }, 100)
    return () => {
      clearTimeout(t)
      io.disconnect()
    }
  }, [isHome, pathname])

  const goSection = (id) => {
    setOpen(false)
    setMenu(false)
    if (isHome) scrollToId(id)
    else navigate('/', { state: { scrollTo: id } })
  }

  const linkCls = (on) =>
    `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${on ? 'text-white' : 'text-white/55 hover:text-white'}`
  const pill = <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" />

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: intro(2.4), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          className={`flex w-full max-w-4xl items-center justify-between rounded-full py-2.5 pr-2.5 pl-6 transition-all duration-500 ${
            scrolled || !isHome ? 'glass bg-ink/70 shadow-[0_10px_40px_-15px_rgb(139_92_246/0.5)]' : 'border border-transparent'
          }`}
        >
          <Link to="/" className="font-script text-3xl leading-none text-blush" aria-label={`${site.name} — home`}>
            {site.name}
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            <li>
              <button onClick={() => goSection('about')} className={linkCls(active === 'about')}>
                {active === 'about' && pill}
                <span className="relative">About</span>
              </button>
            </li>

            <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              <button
                onClick={() => goSection('work')}
                onFocus={() => setOpen(true)}
                aria-haspopup="true"
                aria-expanded={open}
                className={linkCls(active === 'work' || !isHome)}
              >
                {(active === 'work' || !isHome) && pill}
                <span className="relative flex items-center gap-1.5">
                  Work
                  <svg viewBox="0 0 12 12" className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m2 4 4 4 4-4" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="glass absolute top-full left-1/2 mt-2 w-56 -translate-x-1/2 rounded-2xl bg-ink/90 p-2 shadow-2xl"
                  >
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={`/${c.slug}`}
                          className={`block rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                            pathname === `/${c.slug}` ? 'text-rose' : 'text-white/80'
                          }`}
                        >
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            <li>
              <button onClick={() => goSection('contact')} className={linkCls(active === 'contact')}>
                {active === 'contact' && pill}
                <span className="relative">Contact</span>
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goSection('contact')}
              className="rounded-full bg-linear-to-r from-violet to-rose px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Hire me
            </button>
            <button
              onClick={() => setMenu((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 md:hidden"
              aria-label="Menu"
              aria-expanded={menu}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all ${menu ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all ${menu ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-ink/95 py-24 backdrop-blur-xl md:hidden"
          >
            <Link to="/" className="font-display text-3xl font-bold" onClick={() => setMenu(false)}>
              Home
            </Link>
            <button onClick={() => goSection('about')} className="font-display text-3xl font-bold">
              About
            </button>
            <button onClick={() => goSection('work')} className="font-display text-3xl font-bold">
              Work
            </button>
            <div className="flex flex-col items-center gap-3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/${c.slug}`}
                  className={`text-lg ${pathname === `/${c.slug}` ? 'text-rose' : 'text-white/60'}`}
                  onClick={() => setMenu(false)}
                >
                  {c.title}
                </Link>
              ))}
            </div>
            <button onClick={() => goSection('contact')} className="font-display text-3xl font-bold">
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
