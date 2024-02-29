<template lang="pug">
  v-row#cycles
    v-col(cols=6 v-for="cycle in ['monthly', 'yearly']" :key="cycle" @click="store.selectCycle(cycle)" )
      v-card(flat @click="store.selectPlan(plan.id)" :class="{ selected: store.selectedCycle === cycle }" )
        v-card-title
          h3 {{cycle.charAt(0).toUpperCase() + cycle.slice(1)}}
          v-btn#discount(color="primary" flat v-if="cycle==='yearly'") Save {{store.selectedPlan.price.discount}}%
        v-card-text
          span ${{store.selectedPlan.price[cycle]}} per month
</template>

<script setup>
const props = defineProps({
  plan: Object
})

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
    background-color: #F6F8FE

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