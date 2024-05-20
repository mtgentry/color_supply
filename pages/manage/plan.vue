<template lang="pug">
  ManageLayout
    v-container(fluid)
      v-row(v-if="status")
        v-col(cols="12")
          v-alert(:text="alertMessage" type='info' closable v-if="status === 'success'" icon="mdi-check-circle" )
      v-row.plans
        v-col#toggle.centered.flex-row(cols="12")
          v-btn(v-for="interval in intervals" :key="interval" flat :variant="selectedInterval === interval ? undefined : 'outlined'"
            :color="selectedInterval === interval ? 'primary': 'gray'"
          @click="selectInterval(interval)") {{capitalized(interval)}}ly
        v-col.centered(md="3" sm="6" sx="12" cols="12" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan")

</template>

<script setup>
const { data } = useAuth()
const route = useRoute()
const planStore = usePlanStore()
const {selectInterval} = planStore
const { plans, selectedInterval } = storeToRefs(planStore)
const intervals = ['month', 'year']
const status = computed(() => route.query.status)
const alertMessage = computed(() => {
  if (status.value === 'success') {
    return `Success! Your subscription plan has been changed to ${data.value.plan.name}`
  }
})
</script>

<style scoped lang="sass">
#toggle
  margin: 128px 0 64px 0
  .v-btn
    margin-right: 12px
    width: 120px
.plans
  @media (min-width: 1904px)
    padding: 0 220px
</style>