<template lang="pug">
  v-row#cycles
    v-col(cols=6 v-for="cycle in store.selectedPlan.cycles")
      v-card(flat @click="store.selectCycle(cycle.period)" :class="{ selected: store.selectedCycle === cycle.period }" )
        v-card-title
          h3 {{cycle.period.charAt(0).toUpperCase() + cycle.period.slice(1)}}
          v-btn#discount(color="primary" flat v-if="cycle.period === 'yearly'") Save {{parseInt(cycle.discount)}}%
        v-card-text
          span ${{cycle.price}} per month
</template>

<script setup>
const store = usePlanStore()

</script>

<style scoped lang="sass">
#cycles
  padding-bottom: 36px
.v-card
  color: var(--color3)
  border: 1px solid var(--color4)
  padding: 1px 1px 1px 1px

  &.selected
    border: 2px solid var(--color1)
    padding: 0
    background-color: var(--color8)

    h3
      color: var(--color1)

    p
      color: var(--color2)

  .v-card-title
    display: flex
    justify-content: space-between

h3
  color: var(--color2)
  font-size: 20px
  font-style: normal
  font-weight: 700
  line-height: normal
  letter-spacing: 0.4px

#discount
  background-color: var(--color1)!important
  border-radius: 5px
  color: var(--color7)
  font-size: 11px
  font-style: normal
  font-weight: 400
  line-height: normal
  height: 26px

</style>