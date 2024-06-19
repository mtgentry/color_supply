<template lang="pug">
  v-card#plan(:class="{selected: active || selected}" flat)
    v-card-title
      p {{plan.name}}
      v-btn#current(color="primary" size="small" disabled v-if="active") Current Plan
    v-card-text#space
      div
        p(v-if="price?.value")
          sup $
          span#price {{price.value}}
          span /{{selectedInterval}}
        p#priceRow(v-else) Free
        p#description {{plan.description}}
        p · Save up to {{plan.metadata.favorites}} favorites
      v-btn#select(width="100%" variant="outlined" v-if="active && data.plan.stripe" @click="createCheckout" :disabled="pending") Manage
      v-btn#select(width="100%" variant="outlined" v-if="!active && !selected" @click="selectPlan(price.id)") Select Plan
  v-btn#upgrade(variant="outlined" width="100%" :class="{hide: active|| !selected}"
    @click="createCheckout" :disabled="pending") {{action}} to {{plan.name}}
</template>

<script setup>
const props = defineProps({
  plan: Object,
})
const {data, getSession} = useAuth()
const planStore = usePlanStore()
const {selectPlan} = planStore
const {selectedPlan, selectedInterval} = storeToRefs(planStore)
const pending = ref(false)

const price = computed(() => {
  if (props.plan.prices.length < 2) return props.plan.prices[0]
  return props.plan.prices.find(c => c.interval === selectedInterval.value)
})
const active = computed(() => {
  if (data.value.plan.name === props.plan.name) {
    if (props.plan.name === 'Basic') return true
    return data.value.plan.interval === selectedInterval.value
  }})
const selected = computed(() => {
  return selectedPlan.value === price.value.id
})
const action = computed(() => {
  if (price.value.value > parseFloat(data.value.plan.amount)) {
    return 'Upgrade'
  } else {
    return 'Downgrade'
  }
})
const createCheckout = async () => {
  pending.value = true
  const checkout = await fetch('/plans/checkout/', 'post', {
    price_id: price.value.id,
  })
  if (checkout.url) {
    await navigateTo(checkout.url, {external: true})
  } else {
    await getSession()
  }
  pending.value = false
  selectedPlan.value = null
}
</script>

<style scoped lang="sass">
.v-card
  color: var(--color2)
  border: 1px solid var(--color4)
  height: 100%

  font-size: 16px!important
  min-height: 284px
  font-weight: 500
  padding: 0 0 20px 0

  &.selected
    outline: 2px solid var(--color1)
    outline-offset: -2px

    background-color: var(--color8)
    h3
      color: var(--color2)
    p
      color: var(--color2)

  .v-card-title
    display: flex
    justify-content: space-between
    font-size: 16px!important
    padding: 24px 24px 0 24px

  .v-card-text
    font-size: 16px!important
    padding: 0 24px

h3
  color: var(--color2)
  letter-spacing: 0.4px

sup
  font-size: 18px
  top: -20px

#description
  font-size: 15px
  padding-bottom: 15px
  font-weight: 400

#price
  font-size: 48px
  font-weight: 500
  line-height: normal
  letter-spacing: 0.96px

#priceRow
  min-height: 50px
  display: flex
  align-items: flex-end
  margin-bottom: 15px

#current
  position: relative
  top: -15px
  right: -15px
  :deep(.v-btn__overlay)
    opacity: 0

#space
  display: flex
  flex-direction: column

#select
  margin-top: 40px
  margin-bottom: 10px

#upgrade
  margin-top: 24px

.hide
  visibility: hidden!important
</style>