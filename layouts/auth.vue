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
  font-family: "IBM Plex Sans", sans-serif!important

#auth
  margin: -16px

  display: flex
  align-items: center
  justify-content: center

  .v-col
    height: 100vh

.branding
  background-color: #DEDCE1

img
  width: 100%
  height: auto
  margin: 0 auto

// css for pages

.form
  max-width: 450px
  min-width: 450px

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

</style>