<template lang="pug">
  v-app(dark)
    NavBar
    v-main
      v-container(fluid)
        slot
      DialogsSignUp
      DialogsLogin
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

.v-application
  background-color: var(--color6)

.v-btn
  font-size: 14px
  font-style: normal
  font-weight: 500
  line-height: normal
  letter-spacing: 0.28px
  text-transform: none

.v-row
  margin: -16px

h2
  font-size: 22px
  font-weight: 400
  letter-spacing: 0.44px

.fade-enter-active, .fade-leave-active
  transition: all 0.13s

.fade-enter-from, .fade-leave-to
  opacity: 0
</style>