// The white and black the Visualize blocks artboard adds to the palette's colors
// (lib/visualize/blocks.js): each on or off, set from the artboard's menu
// (components/visualize/Buttons.vue). Both on by default; remembered in this
// browser. They're part of the scene, never the palette.
const KEY = 'visualizeNeutrals'
const DEFAULT = { white: true, black: true }

const read = () => {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...DEFAULT }
  }
}

export const useSceneNeutrals = () => {
  const neutrals = useState('sceneNeutrals', read)
  return {
    neutrals,
    toggleNeutral: (name) => {
      neutrals.value = { ...neutrals.value, [name]: !neutrals.value[name] }
      try {
        localStorage.setItem(KEY, JSON.stringify(neutrals.value))
      } catch {}
    },
  }
}
