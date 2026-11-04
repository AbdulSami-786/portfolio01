import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { startTracking, trackPage, trackingEnabled } from '../lib/tracker'

/** Records each visit and page view to the Google Sheet. Renders nothing; off when no endpoint is set. */
export default function Analytics() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (trackingEnabled) startTracking(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (trackingEnabled) trackPage(pathname)
  }, [pathname])

  return null
}
