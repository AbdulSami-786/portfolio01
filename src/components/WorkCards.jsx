import { useRef } from 'react'
import { Icon } from './ui'
import { useModal } from '../lib/modal'

/** Video thumbnail — plays a muted preview on hover, opens the full player on click. */
export function VideoCard({ p, large = false }) {
  const open = useModal()
  const video = useRef(null)

  const play = () => {
    const v = video.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => {})
  }
  const stop = () => video.current?.pause()

  const media = (
    <button
      data-cursor="Play"
      onClick={() => open({ ...p, type: 'video' })}
      onPointerEnter={play}
      onPointerLeave={stop}
      onFocus={play}
      onBlur={stop}
      aria-label={`Play ${p.title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/30"
    >
      <video
        ref={video}
        src={p.src}
        poster={p.poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
      <span className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-xl transition-transform duration-300 group-hover:scale-110">
        <Icon name="play" className="h-6 w-6 translate-x-0.5" fill />
      </span>
      <span className="absolute right-3 bottom-3 rounded-md bg-black/75 px-2 py-0.5 font-mono text-xs">{p.duration}</span>
    </button>
  )

  if (large) {
    return (
      <div className="grid items-center gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
        {media}
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-rose uppercase">{p.label}</p>
          <h3 className="mt-3 font-display text-3xl font-bold">{p.title}</h3>
          <p className="mt-4 leading-relaxed text-white/60">{p.desc}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="text-white/40">Category</dt>
              <dd className="mt-1 font-medium">{p.label}</dd>
            </div>
            <div>
              <dt className="text-white/40">Length</dt>
              <dd className="mt-1 font-medium">{p.duration}</dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return (
    <article>
      {media}
      <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">{p.desc}</p>
    </article>
  )
}

/** YouTube thumbnail with its published view count. */
export function ThumbCard({ t }) {
  const open = useModal()
  return (
    <article>
      <button
        data-cursor="View"
        onClick={() => open({ ...t, type: 'image', label: `YouTube thumbnail · ${t.views} views` })}
        className="group block w-full overflow-hidden rounded-xl bg-white ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/40"
        aria-label={`Open thumbnail: ${t.title}`}
      >
        <img
          src={t.src}
          alt={`Thumbnail design: ${t.title}`}
          loading="lazy"
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </button>
      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="line-clamp-2 text-sm text-white/65">{t.title}</p>
        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{t.views} views</span>
      </div>
    </article>
  )
}

/** Print / brand design piece — small image in the grid, full image in the lightbox. */
export function DesignCard({ d }) {
  const open = useModal()
  return (
    <button
      data-cursor="View"
      onClick={() => open({ ...d, type: 'image' })}
      aria-label={`Open ${d.title}`}
      className="group block w-full overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/40"
    >
      <img
        src={d.thumb}
        width={d.w}
        height={d.h}
        alt={d.title}
        loading="lazy"
        className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </button>
  )
}

/** Banner shown at its natural proportions (never cropped). */
export function BannerCard({ b }) {
  const open = useModal()
  return (
    <article>
      <button
        data-cursor="View"
        onClick={() => open({ ...b, type: 'image' })}
        className="group block w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/40"
        aria-label={`Open banner: ${b.title}`}
      >
        <img src={b.src} alt={b.title} loading="lazy" className="h-auto w-full" />
      </button>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-display text-lg font-bold">{b.title}</h3>
        <p className="text-sm text-white/45">{b.label}</p>
      </div>
    </article>
  )
}
