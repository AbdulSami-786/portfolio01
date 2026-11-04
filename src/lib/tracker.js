// Visitor tracker → Google Sheet (via the Apps Script in /tracking/Code.gs).
//
// Sent per visit:  IP address, pages viewed, time on site (only while the tab is visible),
// device / browser, language, timezone, referrer.  Date, day and time are stamped by the
// Google script on the server so a visitor's clock can't change them.
//
// Nothing is stored in the browser.

import { analytics } from '../data/site'

const ENDPOINT = import.meta.env.VITE_TRACKING_URL || analytics.endpoint
const PING_EVERY_MS = 30_000

let started = false
let sid = ''
let visibleMs = 0
let lastTick = 0
let pingTimer = null
let currentPage = ''
let pendingPage = ''

export const trackingEnabled = Boolean(ENDPOINT)

const seconds = () => {
  const live = document.visibilityState === 'visible' && lastTick ? performance.now() - lastTick : 0
  return Math.round((visibleMs + live) / 1000)
}

function post(payload, { beacon = false } = {}) {
  const body = JSON.stringify({ sid, ...payload })
  // text/plain keeps this a "simple" request, so Google's endpoint needs no CORS preflight
  try {
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }))
      return
    }
    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* never let tracking break the site */
  }
}

async function lookupIp() {
  const urls = ['https://api.ipify.org?format=json', 'https://api64.ipify.org?format=json']
  for (const url of urls) {
    try {
      const ctl = new AbortController()
      const t = setTimeout(() => ctl.abort(), 4000)
      const res = await fetch(url, { signal: ctl.signal })
      clearTimeout(t)
      const { ip } = await res.json()
      if (ip) return ip
    } catch {
      /* try the next one */
    }
  }
  return 'unknown'
}

function device() {
  const ua = navigator.userAgent
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'Tablet'
  return /Mobi|iPhone|Android/i.test(ua) ? 'Mobile' : 'Desktop'
}

function browser() {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\/|Opera/.test(ua)) return 'Opera'
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Other'
}

const onVisibility = () => {
  if (document.visibilityState === 'hidden') {
    visibleMs += lastTick ? performance.now() - lastTick : 0
    lastTick = 0
    post({ type: 'end', duration: seconds() }, { beacon: true })
  } else {
    lastTick = performance.now()
  }
}
const onPageHide = () => post({ type: 'end', duration: seconds() }, { beacon: true })

export async function startTracking(page) {
  if (!trackingEnabled || started) return
  started = true
  sid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)
  currentPage = page
  lastTick = performance.now()

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onPageHide)

  const ip = await lookupIp()
  if (!started) return // consent withdrawn while the IP lookup was running
  post({
    type: 'start',
    ip,
    page: pendingPage || currentPage,
    duration: seconds(),
    device: device(),
    browser: browser(),
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    screen: `${window.screen.width}x${window.screen.height}`,
    referrer: document.referrer || 'Direct',
  })

  pingTimer = setInterval(() => {
    if (document.visibilityState === 'visible') post({ type: 'ping', duration: seconds() })
  }, PING_EVERY_MS)
}

export function trackPage(page) {
  if (!started || page === currentPage) return
  currentPage = page
  pendingPage = page
  if (sid) post({ type: 'page', page, duration: seconds() })
}

export function stopTracking() {
  if (!started) return
  started = false
  clearInterval(pingTimer)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('pagehide', onPageHide)
}
