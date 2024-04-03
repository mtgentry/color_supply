<template lang="pug">
  v-layout
    v-container(fluid)
      v-row#auth
        v-col.d-flex.justify-center.align-center(cols="6")
          slot
        v-col.pa-0.branding.d-flex.justify-center.align-center(cols="6")
          img(src="/img/branding.png")

</template>

<style lang="sass">
html
  overflow: hidden

#auth
  margin: -16px

  display: flex
  align-items: center
  justify-content: center

.branding
  background-color: #DEDCE1

img
  width: 100%
  height: auto
  margin: 0 auto

// css for pages

.form
  max-width: 550px
  min-width: 550px

h1
  margin-bottom: 22px

#submit
  width: 100%
  margin: 14px 0
  text-transform: unset
  font-size: 16px
  letter-spacing: 0.32px

#description
  text-align: center

.v-divider
  margin: 27px 200px

.v-btn--disabled
  background-color: var(--color4) !important
  color: var(--color3)

.centered
  display: flex
  align-items: center
  justify-content: center

.v-input__details
  padding-bottom: 5px
</style>