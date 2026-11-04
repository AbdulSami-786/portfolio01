import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './ui'
import { scrollState } from '../lib/scroll'

/** Full-screen lightbox for either a video or an image. `item` = null closes it. */
export default function Modal({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    scrollState.lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      scrollState.lenis?.start()
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 transition-colors hover:bg-rose hover:text-ink"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>

          <motion.div
            initial={{ scale: 0.88, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl bg-black shadow-[0_40px_120px_-20px_rgb(139_92_246/0.6)] ring-1 ring-white/10">
              {item.type === 'image' ? (
                <img src={item.src} alt={item.title} className="max-h-[75vh] w-full object-contain" />
              ) : (
                <video
                  key={item.src}
                  src={item.src}
                  poster={item.poster}
                  className="aspect-video w-full"
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </div>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4 px-1">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-rose uppercase">{item.label}</p>
                <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{item.title}</h3>
                {item.desc && <p className="mt-2 max-w-2xl text-white/60">{item.desc}</p>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
