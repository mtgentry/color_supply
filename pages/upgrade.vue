<template lang="pug">
  div.form
    h1 Select a plan
    div
      Plan(:plan="plan" v-for="plan in store.plans" :key="plan.id")
      v-btn#submit(color="primary" text @click="login" :disabled="!store.selectedPlan") Continue
</template>

<script setup>

definePageMeta({
  layout: 'auth',
})
const store = usePlanStore()
</script>

<style scoped lang="sass">
.v-btn--disabled
  background-color: var(--color4) !important
  color: var(--color3)
</style>