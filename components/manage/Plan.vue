<template lang="pug">
  v-card#plan(:class="{selected: active}" flat)
    v-card-title
      p {{plan.name}}
      v-btn#current(color="primary" size="small" disabled v-if="active") Current Plan
    v-card-text#space
      div
        p(v-if="price?.value")
          sup $
          span#price {{price.value}}
          span /{{interval}}
        p#priceRow(v-else) Free
        p#description {{plan.description}}
        p · Save up to {{plan.metadata.favorites}} favorites
      v-btn#select(width="100%" variant="outlined" v-if="!active" @click="createCheckout") Select Plan
</template>

<script setup>
const props = defineProps({
  plan: Object,
  interval: String,
})
const {data} = useAuth()

const price = computed(() => props.plan.prices.find(c => c.interval === props.interval))
const active = computed(() => {
  if (data.value.subscription.plan === props.plan.name) {
    if (props.plan.name === 'Basic') return true
    return data.value.subscription.interval === props.interval
  }})

const createCheckout = async () => {
  const checkout = await fetch('/plans/checkout/', 'post', {
    price_id: price.value.id,
  })
  await navigateTo(checkout.url, {external: true})
}
</script>

<style scoped lang="sass">
.v-card
  color: var(--color2)
  border: 1px solid var(--color4)
  max-width: 244px

  font-size: 16px!important
  min-height: 284px
  font-weight: 500

  &.selected
    border: 2px solid var(--color1)
    padding: 0 0 20px 0
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
  font-size: 12px

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
  height: 100%

#select
  margin-top: 40px
</style>