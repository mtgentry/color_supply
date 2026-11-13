<template lang="pug">
  //- A review page, not linked from the site: palettes scoring 5 or lower, as they
  //- are and four ways even_out_lightness could change them (lib/lightness/test-4.json)
  #lightnessTest
    header
      h1 Lightness test 4
      .tally
        span {{ PICKABLE.map((v) => `${count(v.key)} ${v.label.toLowerCase()}`).join(', ') }} picked, of {{ rows.length }}
        v-btn(size="small" variant="outlined" :disabled="!Object.keys(picks).length" @click="copy") {{ copied ? 'Copied' : 'Copy picks' }}
      p {{ rows.length }} palettes scoring 5.0 or lower ({{ favorited }} favorited), each darkest to lightest, in color, then in gray. The darkest and lightest colors stay. Even: the colors between are evenly spaced in lightness. Gentle, Medium and Strong: spaced along a curve fitted to the original, so a palette that leans light or dark keeps leaning that way; Gentle is closest to even, Strong closest to the original. Pick the version that's better, or neither.
    .table
      .row.head
        span Palette
        span Favorites
        template(v-for="v in VERSIONS" :key="v.key")
          span {{ v.label }}
          span
          span(v-if="v.key !== 'before'")
      .row(v-for="r in rows" :key="r.id")
        span.id {{ r.id }}
        span.favorites {{ r.favorites || '' }}
        template(v-for="{ key: v } in VERSIONS" :key="v")
          span.score {{ r.scores[v].toFixed(1) }}
          .strips
            .strip
              i(v-for="(c, i) in r[v]" :key="i" :style="{ backgroundColor: c }")
            .strip
              i(v-for="(c, i) in r[v]" :key="i" :style="{ backgroundColor: lightnessGray(c) }")
          //- Just right of the version it picks. In a div: Vuetify gives the checkbox
          //- a grid area of its own, which drops it to a new row.
          .pick(v-if="v !== 'before'")
            v-checkbox-btn(:model-value="picks[r.id] === v" @update:model-value="pick(r.id, v)" color="primary" density="compact")
</template>

<script setup>
import palettes from '~/lib/lightness/test-4.json'

useHead({
  title: 'Lightness test 4',
  meta: [{ name: 'robots', content: 'noindex' }]
})

// The versions, left to right. Curves (manage.py even_out_lightness --curve LIMIT): the
// lower the limit, the more of the original's curve is kept. Medium stays 'curve'
// (its first name), so picks made before Gentle and Strong were added still hold.
const VERSIONS = [
  { key: 'before', label: 'Original' },
  { key: 'even', label: 'Even' },
  { key: 'gentle', label: 'Gentle', limit: 0.8 },
  { key: 'curve', label: 'Medium', limit: 0.6 },
  { key: 'strong', label: 'Strong', limit: 0.45 }
]
const PICKABLE = VERSIONS.filter((v) => v.key !== 'before')

// Each palette's colors darkest to lightest, left to right. The script keeps the
// lightness order, so a color sits in the same place in every version.
const rows = palettes.map((p) => {
  const row = { ...p, scores: {} }
  for (const { key: v } of VERSIONS) {
    row[v] = darkestFirst(p[v])
    row.scores[v] = contrastScore(p[v])
  }
  return row
})
const favorited = rows.filter((r) => r.favorites).length

// The best version of each palette, a PICKABLE key (none if no version is better), kept in
// this browser (localStorage) so a reload doesn't lose them
const STORAGE_KEY = 'lightnessTest4Picks'
const picks = ref({})
onMounted(() => {
  try { picks.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { /* starts empty */ }
})
const pick = (id, version) => {
  const next = { ...picks.value }
  if (next[id] === version) delete next[id] // Unchecking: neither
  else next[id] = version                    // One version per palette
  picks.value = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}
const count = (version) => Object.values(picks.value).filter((v) => v === version).length
const idsFor = (version) => Object.keys(picks.value).filter((id) => picks.value[id] === version).map(Number).sort((a, b) => a - b)

const copied = ref(false)
const copy = async () => {
  await navigator.clipboard.writeText(PICKABLE.map((v) =>
    `${v.label.toLowerCase()}${v.limit ? ` (--curve ${v.limit})` : ''}: ${idsFor(v.key).join(' ')}`).join('\n'))
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<style scoped lang="sass">
// The app itself never scrolls (layouts/default.vue), so the page is its own scroll box
#lightnessTest
  height: calc(100vh - 64px)
  overflow-y: auto
  padding: 40px 24px 80px
header, .table
  max-width: 1600px
  margin: 0 auto
header
  margin-bottom: 32px
  h1
    font-size: 24px
    font-weight: 600
    color: var(--color2)
  .tally
    display: flex
    align-items: center
    gap: 16px
    margin-top: 12px
    font-size: 14px
    color: var(--color2)
  p
    margin-top: 6px
    font-size: 14px
    color: var(--color3)
.row
  display: grid
  grid-template-columns: 48px 56px 28px 1fr repeat(4, 28px 1fr 36px)
  gap: 10px
  align-items: center
  padding: 10px 0
  border-bottom: 1px solid #E6E8EB
  font-size: 13px
  color: var(--color2)
  &.head
    font-size: 12px
    color: var(--color3)
    padding-top: 0
.id, .favorites
  color: var(--color3)
.score
  font-weight: 500
.pick
  display: flex
  justify-content: flex-start
  margin-left: -8px // The checkbox's own padding, so it sits close to its palette
.strip
  display: flex
  height: 24px
  border-radius: 4px
  overflow: hidden
  & + .strip
    margin-top: 3px
  i
    flex: 1
</style>
