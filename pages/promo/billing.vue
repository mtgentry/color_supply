<template lang="pug">
  div.form
    v-container(fluid)
      v-row
        v-col#toggle.centered.flex-row(cols="12")
          v-btn(v-for="interval in intervals" :key="interval" flat :variant="selectedInterval === interval ? undefined : 'outlined'"
            :color="selectedInterval === interval ? 'primary': 'gray'"
            @click="selectInterval(interval)") {{capitalized(interval)}}ly
      v-row.plans
        v-col.centered(:lg="12/plans.length" md="6" sm="6" sx="12" cols="12" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan" :badge="plan.name === 'VIP Beta' ? 'Exclusive Offer' : undefined" :promo="true")
</template>

<script setup>
definePageMeta({
  layout: 'auth',
})
const { data } = useAuth()
if (!data.value?.promo) {
  navigateTo('/login')
}
const planStore = usePlanStore()
const {selectInterval} = planStore
const { plans, selectedInterval, selectedPlan } = storeToRefs(planStore)
const intervals = ['month', 'year']
await planStore.fetchPlans('/promo/')
selectedPlan.value = plans.value[0].prices[0].id

</script>

<style lang="sass" scoped>
#toggle
  button:first-child
    margin-right: 15px
</style>