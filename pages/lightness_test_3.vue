<template lang="pug">
  //- A review page, not linked from the site: palettes scoring 5 or lower,
  //- before and after even_out_lightness (lib/lightness/test-3.json)
  #lightnessTest
    header
      h1 Lightness test 3
      .tally
        span {{ checked.size }} of {{ rows.length }} checked as better
        v-btn(size="small" variant="outlined" :disabled="!checked.size" @click="copy") {{ copied ? 'Copied' : 'Copy checked ids' }}
      p {{ rows.length }} palettes scoring 5.0 or lower ({{ favorited }} favorited). The darkest and lightest colors stay; the ones between are evenly spaced in lightness. Each palette darkest to lightest, in color, then in gray.
    .table
      .row.head
        span Palette
        span Favorites
        span Before
        span
        span After
        span
        span Better
      .row(v-for="r in rows" :key="r.id")
        span.id {{ r.id }}
        span.favorites {{ r.favorites || '' }}
        span.score {{ r.beforeScore.toFixed(1) }}
        .strips
          .strip
            i(v-for="(c, i) in r.before" :key="i" :style="{ backgroundColor: c }")
          .strip
            i(v-for="(c, i) in r.before" :key="i" :style="{ backgroundColor: lightnessGray(c) }")
        span.score {{ r.afterScore.toFixed(1) }}
        .strips
          .strip
            i(v-for="(c, i) in r.after" :key="i" :style="{ backgroundColor: c }")
          .strip
            i(v-for="(c, i) in r.after" :key="i" :style="{ backgroundColor: lightnessGray(c) }")
        //- In a div: Vuetify gives the checkbox a grid area of its own, which drops it to a new row
        .better
          v-checkbox-btn(:model-value="checked.has(r.id)" @update:model-value="toggle(r.id)" color="primary" density="compact")
</template>

<script setup>
import palettes from '~/lib/lightness/test-3.json'

useHead({
  title: 'Lightness test 3',
  meta: [{ name: 'robots', content: 'noindex' }]
})

// Each palette's colors darkest to lightest, left to right. The script keeps the
// lightness order, so a color sits in the same place before and after.
const rows = palettes.map((p) => ({
  ...p,
  before: darkestFirst(p.before),
  after: darkestFirst(p.after),
  beforeScore: contrastScore(p.before),
  afterScore: contrastScore(p.after)
}))
const favorited = rows.filter((r) => r.favorites).length

// The palettes checked as better after, kept in this browser (localStorage) so a
// reload doesn't lose them. "Copy checked ids" puts them on the clipboard to apply.
const STORAGE_KEY = 'lightnessTest3Checked'
const checked = ref(new Set())
onMounted(() => {
  try { checked.value = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) } catch { /* starts empty */ }
})
const toggle = (id) => {
  const next = new Set(checked.value)
  next.has(id) ? next.delete(id) : next.add(id)
  checked.value = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
}
const copied = ref(false)
const copy = async () => {
  await navigator.clipboard.writeText([...checked.value].sort((a, b) => a - b).join(' '))
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
header
  max-width: 960px
  margin: 0 auto 32px
  .tally
    display: flex
    align-items: center
    gap: 16px
    margin-top: 12px
    font-size: 14px
    color: var(--color2)
  h1
    font-size: 24px
    font-weight: 600
    color: var(--color2)
  p
    margin-top: 6px
    font-size: 14px
    color: var(--color3)
.table
  max-width: 960px
  margin: 0 auto
.row
  display: grid
  grid-template-columns: 70px 80px 50px 1fr 50px 1fr 56px
  gap: 16px
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
