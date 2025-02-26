<template lang="pug">
  div.form
    v-container(fluid)
      v-row
        v-col#toggle.centered.flex-row(cols="12")
          v-btn(v-for="interval in intervals" :key="interval" flat :variant="selectedInterval === interval ? undefined : 'outlined'"
            :color="selectedInterval === interval ? 'primary': 'gray'"
            @click="selectInterval(interval)") {{capitalized(interval)}}ly
      v-row.plans
        v-col.centered.plan-col(:lg="12/plans.length" md="6" sm="6" sx="12" cols="12" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan" :badge="plan.name === 'VIP Beta' ? 'Exclusive Offer' : undefined" :promo="true")
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
})
const { data } = useAuth()

const planStore = usePlanStore()
const {selectInterval} = planStore
selectInterval('year')
const { plans, selectedInterval, selectedPlan } = storeToRefs(planStore)
const intervals = ['month', 'year']
await planStore.fetchPlans('/promo/')
selectedPlan.value = plans.value[0].prices[1].id

</script>

<style lang="sass" scoped>
#toggle
  button
    width: 80px
    &:first-child
      margin-right: 15px

:deep(.v-card)
  width: 244px

.plan-col
  padding: 40px 16px 12px 16px
</style>