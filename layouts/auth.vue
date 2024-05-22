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

<style lang="sass">
html
  overflow: hidden

#auth
  margin: -16px

  display: flex
  align-items: center
  justify-content: center

  h1
    margin-bottom: 22px

  .branding
    background-color: #DEDCE1

  .form
    max-width: 550px
    min-width: 550px

  .v-divider
    margin: 27px 200px

  .v-btn--disabled
    background-color: var(--color4) !important
    color: var(--color3)

  .v-input__details
    padding-bottom: 5px


#cover
  width: 100%
  height: auto
  margin: 0 auto


#submit
  width: 100%
  margin: 14px 0
  text-transform: unset
  font-size: 16px
  letter-spacing: 0.32px

#description
  text-align: center


</style>