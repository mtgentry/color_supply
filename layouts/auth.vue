<template lang="pug">
  v-layout
    v-container(fluid)
      v-row#auth
        v-col.d-flex.justify-center.align-center(cols="6")
          slot
        v-col.pa-0.branding.d-flex.justify-center.align-center(cols="6")
          img#cover(src="/img/branding.png")
    NuxtSnackbar
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Color Supply` : 'Color Supply';
  }
})
</script>

<style lang="sass" scoped>
html
  overflow-x: hidden
  overflow-y: auto

#auth
  margin: -16px
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  h1
    margin-bottom: 22px
  @media (max-width: 768px)
    min-height: auto
    flex-direction: column
    margin: 0
    .branding
      order: -1
      height: auto  // Remove fixed height
      width: 100%
      background: none  // Remove background from container
    > .v-col
      flex: 1
      padding: 0
      width: 100%
      max-width: 100%

.branding
  background-color: #DEDCE1
  min-height: 100vh
  display: flex
  align-items: center
  @media (max-width: 768px)
    min-height: auto
    background: none  // Remove background from branding
    position: relative
    &:before    // Add background only behind the image
      content: ''
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-color: #DEDCE1
      z-index: -1

#cover
  width: 100%
  height: auto
  margin: 0 auto
  display: block

// Rest of the styles remain the same...
.form
  max-width: 550px
  min-width: 550px
  @media (max-width: 768px)
    min-width: 100%
    max-width: 100%
    padding: 0 16px

.v-divider
  margin: 27px 200px

.v-btn--disabled
  background-color: var(--color4) !important
  color: var(--color3)

.v-input__details
  padding-bottom: 5px

#submit
  width: 100%
  margin: 14px 0
  text-transform: unset
  font-size: 16px
  letter-spacing: 0.32px

#description
  text-align: center
</style>