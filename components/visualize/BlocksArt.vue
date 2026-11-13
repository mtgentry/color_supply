<template lang="pug">
  //- The blocks layout for one palette (lib/visualize/blocks.js), scaled to fit its box
  svg(:viewBox="`0 0 ${WIDTH} ${HEIGHT}`" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Palette shown as blocks of color")
    rect(v-for="(b, i) in BLOCKS" :key="'b' + i" :x="b.x" :y="b.y" :width="b.w" :height="b.h" :fill="roles[b.role]")
    //- Module 1's stars, each scaled from its 267-unit file
    path.star(
      v-for="s in STARS" :key="'s' + s.star"
      :d="STAR_PATHS[s.star]"
      :transform="`translate(${s.x} ${s.y}) scale(${s.size / STAR_SIZE})`"
      :fill="starColor(roles, s.role)")
    //- Module 2: large circle, ring of dots, small circle with a star
    circle.shape(:cx="CIRCLES.big.cx" :cy="CIRCLES.big.cy" :r="CIRCLES.big.r" :fill="circles.big")
    path.shape(
      :d="RING_PATH"
      :transform="`translate(${CIRCLES.ring.x} ${CIRCLES.ring.y}) scale(${CIRCLES.ring.scale})`"
      :fill="circles.ring")
    circle.shape(:cx="CIRCLES.small.cx" :cy="CIRCLES.small.cy" :r="CIRCLES.small.r" :fill="circles.small")
    path.shape(
      :d="SMALL_STAR_PATH"
      :transform="`translate(${CIRCLES.star.x} ${CIRCLES.star.y}) scale(${CIRCLES.star.scale})`"
      :fill="circles.star")
    //- Module 5: a ring of small dots and a cluster of dots
    path.shape(
      v-for="(g, name) in DOT_GROUPS" :key="name"
      :d="name === 'ring' ? SMALL_RING_PATH : CLUSTER_PATH"
      :transform="`translate(${g.x} ${g.y}) scale(${g.scale})`"
      :fill="dotGroupColor(roles, g.role)")
    //- Module 6: a disc with a hole (the module shows through) and a hoop
    path.shape(
      :d="DISC_PATH" fill-rule="evenodd"
      :transform="`translate(${ROUNDS.disc.x} ${ROUNDS.disc.y}) scale(${ROUNDS.disc.scale})`"
      :fill="discColor(roles)")
    path.shape(
      :d="HOOP_PATH" fill-rule="evenodd"
      :transform="`translate(${ROUNDS.hoop.x} ${ROUNDS.hoop.y}) scale(${ROUNDS.hoop.scale})`"
      :fill="hoopColor(roles, ink)")
    //- Module 7's letter, and the circle with an asterisk over modules 7 and 8
    path.shape(
      :d="A_PATH"
      :transform="`translate(${LETTER.x} ${LETTER.y}) scale(${LETTER.scale})`"
      :fill="letterColor(roles, ink)")
    circle.shape(:cx="BADGE.cx" :cy="BADGE.cy" :r="BADGE.r" :fill="badge.circle")
    path.line(
      :d="ASTERISK_PATH" fill="none" :stroke-width="ASTERISK_STROKE"
      :transform="`translate(${BADGE.asterisk.x} ${BADGE.asterisk.y}) scale(${BADGE.asterisk.scale})`"
      :stroke="badge.asterisk")
    //- Module 3's eye: almond white, iris, pupil, on one center
    path.eye(
      :d="EYE_WHITE_PATH"
      :transform="`translate(${EYE.white.x} ${EYE.white.y}) scale(${EYE.scale})`"
      :fill="eye.white")
    circle.eye(:cx="EYE.cx" :cy="EYE.cy" :r="EYE.irisRadius" :fill="eye.iris")
    circle.eye(:cx="EYE.cx" :cy="EYE.cy" :r="EYE.pupilRadius" :fill="eye.pupil")
    //- Module 4's dots, one path in the file's own units (a nested svg clips them to its box)
    svg(:x="DOTS_BOX.x" :y="DOTS_BOX.y" :width="DOTS_BOX.w" :height="DOTS_BOX.h" :viewBox="`0 0 ${DOTS_WIDTH} ${DOTS_HEIGHT}`")
      path.dots(:d="DOTS_PATH" :fill="dotColor")
    g(v-for="(b, i) in BLOCKS" :key="'n' + i")
      //- Module numbers, top left (the /layout_2 prototype), black or white for the block's color
      text.number(
        v-if="numbered"
        :x="b.x + 28" :y="b.y + 28 + NUMBER_SIZE"
        :font-size="NUMBER_SIZE"
        :fill="changeColorForBackground(roles[b.role])") {{ i + 1 }}
</template>

<script setup>
import { TOP, blocksLayout, INK, roleColors, starColor, eyeColors, circlesColors, dotGroupColor, discColor, badgeColors, letterColor, hoopColor, neutralColors } from '~/lib/visualize/blocks.js'
import { STAR_PATHS, STAR_SIZE, SMALL_STAR_PATH } from '~/lib/visualize/stars.js'
import { RING_PATH, SMALL_RING_PATH, CLUSTER_PATH, DISC_PATH, HOOP_PATH } from '~/lib/visualize/ring.js'
import { A_PATH, ASTERISK_PATH, ASTERISK_STROKE } from '~/lib/visualize/glyphs.js'
import { EYE_WHITE_PATH } from '~/lib/visualize/eye.js'
import { DOTS_PATH, DOTS_WIDTH, DOTS_HEIGHT } from '~/lib/visualize/dots.js'

const props = defineProps({
  colors: { type: Array, default: () => [] },
  numbered: Boolean, // Number the modules 1-8, in BLOCKS order
  top: { type: Number, default: TOP }, // Module 1's height, in layout units
  stacked: Boolean, // The narrow layout: modules 2 to 6 one above another
  // White and black added to the scene: { white, black, tinted } (booleans), or null for none
  neutrals: { type: Object, default: null },
})
// The layout for this module 1 height (lib/visualize/blocks.js)
const layout = computed(() => blocksLayout(props.top, { stacked: props.stacked }))
const WIDTH = computed(() => layout.value.WIDTH)
const HEIGHT = computed(() => layout.value.HEIGHT)
const BLOCKS = computed(() => layout.value.BLOCKS)
const STARS = computed(() => layout.value.STARS)
const CIRCLES = computed(() => layout.value.CIRCLES)
const DOT_GROUPS = computed(() => layout.value.DOT_GROUPS)
const ROUNDS = computed(() => layout.value.ROUNDS)
const EYE = computed(() => layout.value.EYE)
const DOTS_BOX = computed(() => layout.value.DOTS_BOX)
const LETTER = computed(() => layout.value.LETTER)
const BADGE = computed(() => layout.value.BADGE)
// The scene's white and black, if it adds them (lib/visualize/blocks.js)
const neutrals = computed(() => props.neutrals ? neutralColors(props.colors, props.neutrals) : {})
const ink = computed(() => neutrals.value.black || null)
const roles = computed(() => roleColors(props.colors, neutrals.value.white))
const eye = computed(() => eyeColors(roles.value, ink.value))
const badge = computed(() => badgeColors(roles.value))
const circles = computed(() => circlesColors(roles.value, ink.value))
// Near-black, or white on a dark color
const inkOn = (background) => changeColorForBackground(background) === 'black' ? INK : '#FFFFFF'
// Module 4's dots: the black neutral if it's on and shows there
const dotColor = computed(() => {
  const behind = roles.value[BLOCKS.value[3].role]
  return ink.value && ink.value !== behind ? ink.value : inkOn(behind)
})
const NUMBER_SIZE = 44 // Layout units: about 8-10px on screen at /layout_2's sizes
</script>

<style scoped lang="sass">
rect, .star, .shape, .eye, .dots
  transition: fill .2s
.line
  transition: stroke .2s
.number
  font-family: inherit
  font-weight: 500
  opacity: .7
  pointer-events: none
  user-select: none
</style>
