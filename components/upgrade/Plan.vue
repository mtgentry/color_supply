<template lang="pug">
  v-card(flat @click="store.selectPlan(plan)" :class="{ selected: store.selectedPlan === plan }")
    v-card-title
      h3 {{plan.name}}
      h3(v-if="parseFloat(price) > 0")
        sup $
        span {{price}}/month
      h3(v-else) Free
    v-card-text
      p {{plan.description}}
</template>

<script setup>
const props = defineProps({
  plan: Object
})
const store = usePlanStore()

const price = computed(() => parseInt(props.plan.cycles.find(c => c.period === "monthly").price))

</script>

<style scoped lang="sass">
.v-card
  color: var(--color3)
  border: 1px solid var(--color4)
  padding: 1px 1px 21px 1px
  margin-bottom: 20px

  &.selected
    border: 2px solid var(--color2)
    padding: 0 0 20px 0

    h3
      color: var(--color2)

    p
      color: var(--color2)

  .v-card-title
    display: flex
    justify-content: space-between

h3
  color: var(--color3)
  font-size: 20px
  font-style: normal
  font-weight: 700
  line-height: normal
  letter-spacing: 0.4px

sup
  font-size: 12px

</style>