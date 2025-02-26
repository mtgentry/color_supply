<template lang="pug">
  ManageLayout
    v-container(fluid)
      v-row
        v-col#toggle.centered.flex-row(cols="12")
          v-btn(v-for="interval in intervals" :key="interval" flat :variant="selectedInterval === interval ? undefined : 'outlined'"
            :color="selectedInterval === interval ? 'primary': 'gray'"
            @click="selectInterval(interval)") {{capitalized(interval)}}ly
      v-row.plans(v-if="plans.length && data")
        v-col.centered(lg="3" md="6" sm="6" sx="12" cols="12" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan")
</template>

<script setup>
const {data} = useAuth()

definePageMeta({
  middleware: ['auth'],
})

const planStore = usePlanStore()
const { plans, selectedInterval } = storeToRefs(planStore)
const {selectInterval} = planStore

onMounted(async () => {
  await planStore.fetchPlans()
  selectInterval(data.value?.plan?.interval || 'month')
})

const intervals = ['month', 'year']

</script>

<style scoped lang="sass">
#toggle
  margin: 128px 0 64px 0
  padding: 0
  .v-btn
    margin-right: 12px
    width: 120px
.plans
  :deep(.v-card)
    width: 256px
  @media (min-width: 1904px)
    padding: 0 96px
</style>