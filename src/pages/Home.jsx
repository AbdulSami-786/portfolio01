import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import { Marquee, Stats } from '../components/Marquee'
import Categories from '../components/Categories'
import About from '../components/About'
import Contact from '../components/Contact'
import { scrollToId } from '../lib/scroll'

export default function Home() {
  const { state } = useLocation()

  // arriving from another page with a target section (e.g. "Hire me" on a category page)
  useEffect(() => {
    if (!state?.scrollTo) return
    const t = setTimeout(() => scrollToId(state.scrollTo), 350)
    return () => clearTimeout(t)
  }, [state])

  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <About />
      <Stats />
      <Contact />
    </>
  )
}
