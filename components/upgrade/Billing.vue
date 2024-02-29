<template lang="pug">
  div#plan
    img(src="/img/color.svg" alt="color")
    h2 Color Supply
    span {{store.selectedPlan.name}}
  h1 Billing cycle
  UpgradeCycles
  h1 Card Info
  v-divider
  v-row#total(justify="center" align="center")
    v-col(cols="6")
      h1.pa-0 Total due:
    v-col.d-flex.align-center.justify-end(cols=6)
      span.price ${{store.selectedPlan.price[store.selectedCycle]}}
      span per year
  v-btn#submit(color="primary" @click="next" :disabled="!store.selectedPlan" size="large" ) Purchase
  div.secure
    span Secure Checkout
    img#lock(src="/img/lock.svg" alt="lock")
</template>

<script setup>
const props = defineProps({
  plan: Object
})

const emit = defineEmits(['next'])

const next = () => {
  store.selectPlan(store.selectedPlan)
  emit('next')
}

const store = usePlanStore()

</script>

<style scoped lang="sass">
#plan
  display: flex
  align-items: center
  padding-bottom: 36px

  img
    width: 40px
    height: 40px
    margin: 0

  h2
    font-size: 20px
    font-weight: 700
    letter-spacing: 0.4px
    padding: 0 10px
    margin: 0

  span
    font-size: 14px
    font-weight: 400
    line-height: 24px
    letter-spacing: 0.28px
    padding-top: 4px

h1
  padding-bottom: 24px
  margin: 0

.secure
  display: flex
  align-items: center
  justify-content: center

  img
    width: 20px
    margin: 0
    padding-left: 5px

.price
  font-size: 24px
  font-weight: 500
  padding-right: 5px

#total
  padding-bottom: 24px
</style>