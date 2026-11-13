import { defineStore } from 'pinia'

// The Mix page: what the canvas engine (lib/mix) last reported, kept in
// localStorage so the canvas survives leaving the page, and a handle on the
// engine itself while the page is open (so the sidebar can drop palettes on
// it). The engine is created and destroyed by components/mix/Canvas.vue.
const STATE_KEY = 'mixState'
const INTRO_KEY = 'mixIntroSeen'

export const useMixStore = defineStore('mix', () => {
  // From engine.getState(): { squares, mainPalette, view }, or null before the first canvas
  const state = ref(JSON.parse(localStorage.getItem(STATE_KEY) || 'null'))
  // Hexes of the main palette (the row with the most squares), left to right
  const mainPalette = computed(() => state.value?.mainPalette || [])

  // The main palette while a slider is still moving (state has it once it settles), else null
  const liveMainPalette = ref(null)

  const setState = (next) => {
    state.value = next
    localStorage.setItem(STATE_KEY, JSON.stringify(next))
  }

  // The live engine while the Mix page is open (shallow: it owns its own
  // elements and tweens and must not be made reactive), else null
  const engine = shallowRef(null)

  // The canvas selection, from the engine: { ids, hexes, isRow, bounds }, or null
  const selection = ref(null)

  // The onboarding demo plays on the first visit only
  const introSeen = ref(!!localStorage.getItem(INTRO_KEY))
  const markIntroSeen = () => {
    introSeen.value = true
    localStorage.setItem(INTRO_KEY, '1')
  }

  return { state, mainPalette, liveMainPalette, setState, engine, selection, introSeen, markIntroSeen }
})
