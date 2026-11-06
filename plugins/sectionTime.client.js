// Measures how long people actually spend in each section, as a "Section Time"
// event. Page views only say a section was opened; this says whether it held them.
//
// Counted: active time only. The clock runs while the tab is visible, and stops
// IDLE_MS after the last input (move, scroll, click, key), so a tab left open
// over lunch doesn't count as an hour on Palettes.
//
// Sent: when the user moves to another section, or the tab is hidden or closed
// (pagehide). A hidden tab ends the visit; coming back starts a new one, so a
// visit is one sitting. Hidden/closed sends use the beacon transport, which the
// browser delivers even as the page goes away.
//
// Properties: section, seconds (active), interactions (clicks + key presses, so
// "opened and left" can be told apart from "used it"), ended_by (navigate /
// hidden). Nothing personal.

const SECTIONS = {
  '/palettes': 'Palettes',
  '/wheel': 'Wheel',
  '/mix': 'Mix',
  '/visualize': 'Visualize',
  '/favorites': 'Favorites',
}
const IDLE_MS = 60 * 1000
const MIN_SECONDS = 1 // Shorter visits are redirects passing through, not visits

const sectionOf = (path) => {
  const base = '/' + (path.split('/')[1] || '')
  return SECTIONS[base] ?? null
}

export default defineNuxtPlugin((nuxtApp) => {
  let section = null
  let sectionPath = null // Where the visit was; by the time a navigation ends it, location is the next page
  let activeMs = 0
  let lastActive = 0
  let interactions = 0

  // Adds the time since the last input, up to IDLE_MS (beyond that they'd walked away)
  const tick = (now = Date.now()) => {
    if (!section || !lastActive) return
    activeMs += Math.min(now - lastActive, IDLE_MS)
    lastActive = now
  }

  const start = (path) => {
    section = document.visibilityState === 'visible' ? sectionOf(path) : null
    sectionPath = path
    activeMs = 0
    interactions = 0
    lastActive = section ? Date.now() : 0
  }

  const end = (endedBy, beacon = false) => {
    if (!section) return
    tick()
    const seconds = Math.round(activeMs / 1000)
    const props = { section, seconds, interactions, ended_by: endedBy, page: sectionPath }
    section = null
    lastActive = 0
    if (seconds < MIN_SECONDS) return
    const amplitude = window.amplitude
    if (beacon && amplitude?.setTransport) {
      amplitude.setTransport('beacon')
      trackEvent('Section Time', props)
      amplitude.flush?.()
    } else {
      trackEvent('Section Time', props)
    }
  }

  const onInput = () => tick()
  const onAction = () => { interactions++; tick() }
  const opts = { capture: true, passive: true }
  // Scroll doesn't bubble, and the app scrolls inner elements, so listen in the capture phase
  for (const type of ['pointermove', 'scroll', 'wheel', 'touchmove']) window.addEventListener(type, onInput, opts)
  for (const type of ['pointerdown', 'keydown']) window.addEventListener(type, onAction, opts)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      end('hidden', true)
    } else {
      window.amplitude?.setTransport?.('fetch')
      start(location.pathname)
    }
  })
  // Closing the tab usually fires visibilitychange first; this catches the rest (end() runs once)
  window.addEventListener('pagehide', () => end('hidden', true))

  const router = useRouter()
  router.afterEach((to, from) => {
    if (sectionOf(to.path) === section && from.matched.length) return // Same section, e.g. a query change
    end('navigate')
    start(to.path)
  })
  nuxtApp.hook('app:mounted', () => { if (!section) start(location.pathname) })
})
