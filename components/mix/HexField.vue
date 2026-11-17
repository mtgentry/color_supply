<template lang="pug">
  //- One square selected: its hex, which can be typed or pasted over (any CSS color
  //- works, and becomes a hex) to set the square to an exact color, or copied.
  //- In place of the hue dial (components/mix/Options.vue).
  #hex-field
    label.v-label(for="mix-hex") Hex
    .row(:class="{ invalid }")
      span.swatch(:style="{ backgroundColor: preview || hex }")
      input#mix-hex(
        ref="input"
        v-model="text"
        type="text"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="characters"
        maxlength="40"
        :aria-invalid="invalid"
        aria-describedby="mix-hex-hint"
        @input="onInput"
        @keydown.enter.prevent="onEnter"
        @keydown.esc.stop.prevent="revert(); input.blur()"
        @focus="onFocus"
        @blur="commit")
      button.copy(type="button" aria-label="Copy hex" title="Copy" @click="copy")
        svg(width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true")
          rect(x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor")
          path(d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" stroke="currentColor")
    p#mix-hex-hint.hint(:class="{ error: invalid }") {{ invalid ? 'Not a color. Try a hex like 2A5B96.' : 'Type or paste a color.' }}
  v-divider.section-divider
</template>

<script setup>
import { parse, formatHex, converter } from 'culori'

const mixStore = useMixStore()
const snackbar = useSnackbar()
const toOklch = converter('oklch')

const input = ref(null)
const id = computed(() => mixStore.selection?.ids?.[0])
const hex = computed(() => (mixStore.selection?.hexes?.[0] || '').toUpperCase())

// The field shows the hex without its "#" (typing one is fine)
const bare = (value) => value.replace('#', '')
const text = ref(bare(hex.value))
const invalid = ref(false)
const preview = ref(null) // The typed color while it's valid but not yet committed

// Follow the square (a new selection, or the sliders moving it), unless it's being typed over
watch(hex, (value) => {
  if (document.activeElement !== input.value) text.value = bare(value)
})
watch(id, () => {
  text.value = bare(hex.value)
  invalid.value = false
  preview.value = null
})

// What was typed, as a hex, or null. A bare hex ("2a5b96", "fff") gets its "#"
const toHex = (value) => {
  const v = value.trim()
  if (!v) return null
  const color = parse(/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v) ? `#${v}` : v)
  return color ? formatHex(color).toUpperCase() : null
}

const setSquare = (value, settled) => {
  const engine = mixStore.engine
  const c = toOklch(value)
  if (!engine || !id.value || !c) return
  engine.setColors([{ id: id.value, oklch: { mode: 'oklch', l: c.l, c: c.c, h: c.h ?? 0 } }], { settled })
}

// The square's color when typing started, to go back to (Escape) or tell if it changed
let before = null
const onFocus = () => {
  before = hex.value
  input.value.select()
}

// While typing: the square takes the color as soon as it's a whole one (six hex
// digits, so it doesn't flash on the way through three; or any other CSS color)
const onInput = () => {
  invalid.value = false
  const raw = text.value.trim()
  const value = toHex(raw)
  const whole = !/^#?[0-9a-f]*$/i.test(raw) || /^#?[0-9a-f]{6}$/i.test(raw)
  preview.value = value && whole ? value : null
  if (preview.value) setSquare(preview.value, false)
}

// Enter or leaving the field: the typed color, settled (saved), if it's a color
const commit = () => {
  if (!id.value || before === null) return
  const value = toHex(text.value)
  if (!value) {
    if (text.value.trim()) invalid.value = true
    else revert()
    return
  }
  preview.value = null
  text.value = bare(value)
  if (value !== before) {
    setSquare(value, true)
    trackEvent('Mix Hex Entered', { value })
  }
  before = null
}

// Enter: done, unless it isn't a color (then stay, to fix it)
const onEnter = () => {
  commit()
  if (!invalid.value) input.value.blur()
}

// Escape: back to the square's color before typing
const revert = () => {
  if (before && preview.value) setSquare(before, true)
  preview.value = null
  invalid.value = false
  text.value = bare(before || hex.value)
  before = null
}

const copy = () => clipboard(hex.value, snackbar)
</script>

<style scoped lang="sass">
#hex-field
  .v-label // As the slider labels (components/mix/Sliders.vue)
    display: block
    color: var(--color3)
    opacity: 1
    font-size: 14px
    font-weight: 400
    letter-spacing: 0.28px
    margin-bottom: var(--gap-item, 8px) // Spacing tokens: assets/css/spacing.sass

.row
  display: flex
  align-items: center
  gap: var(--gap-item, 10px)
  height: var(--control-md, 44px)
  padding: 0 var(--gap-tight, 6px) 0 var(--gap-item, 8px)
  border: 1px solid var(--color5)
  border-radius: var(--radius-md, 8px)
  background: var(--color7)
  transition: border-color .15s
  &:focus-within
    border-color: var(--color1)
  &.invalid
    border-color: #D23B2F

.swatch
  flex: none
  width: var(--swatch, 26px)
  height: var(--swatch, 26px)
  border-radius: var(--radius-sm, 5px)
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .12)

input
  flex: 1
  min-width: 0
  height: 100%
  border: 0
  outline: none
  background: none
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace
  font-size: 15px
  letter-spacing: .04em
  color: var(--color2)

.copy
  flex: none
  display: flex
  align-items: center
  justify-content: center
  width: var(--control-sm, 32px)
  height: var(--control-sm, 32px)
  border-radius: var(--radius-sm, 6px)
  color: var(--color3)
  cursor: pointer
  &:hover
    background: var(--color6, #EEE)
    color: var(--color2)
  &:focus-visible
    outline: 2px solid var(--color1)
    outline-offset: 1px

.hint
  margin: var(--gap-tight, 6px) 0 0
  font-size: 12px
  color: var(--color4)
  &.error
    color: #D23B2F

.section-divider // As under the sliders (components/mix/Options.vue)
  margin: var(--gap-section, var(--section-gap)) 0
  border-color: var(--section-rule)
  opacity: 1
</style>
