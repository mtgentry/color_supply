<template lang="pug">
  v-layout
    v-container(fluid)
      v-row#auth()
        v-col(cols="6")
          slot
        v-col.pa-0.branding(cols="6")
          img(src="/img/branding.png")

</template>

<style lang="sass">
  html
    overflow: hidden
    font-family: "IBM Plex Sans", sans-serif!important
  #auth
    margin: -16px
    .v-col
      height: 100vh
    display: flex
    align-items: center
    justify-content: center
  .branding
    background-color: #DEDCE1
  img
    width: 100%
    height: auto
    margin: 0 auto

</style>

<script setup lang="ts">
</script>