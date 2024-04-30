<template lang="pug">
  v-app(dark)
    NavBar
    v-main
      v-container(fluid)
        slot
    NuxtSnackbar
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Color Supply` : 'Color Supply';
  }
})

const planStore = usePlanStore()

planStore.fetchPlans()
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

.centered
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
</style>