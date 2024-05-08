<template lang="pug">
  ManageLayout
    v-container
      v-row(v-if="status")
        v-col(md="12")
          v-alert(:text="alertMessage" type='info' closable v-if="status === 'success'" icon="mdi-check-circle" )
      v-row.plans
        v-col#toggle.centered.flex-row(md="12")
          v-btn(v-for="interval in intervals" :key="interval" flat :variant="selected_interval === interval ? undefined : 'outlined'"
            :color="selected_interval === interval ? 'primary': 'gray'"
          @click="selected_interval=interval") {{capitalized(interval)}}ly
        v-col.centered(md="3" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan" :interval="selected_interval")

</template>

<script setup>
const { data } = useAuth()
const route = useRoute()
const planStore = usePlanStore()
const {plans} = storeToRefs(planStore)
const intervals = ['month', 'year']
const selected_interval = ref('month')
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
  padding: 0 220px
</style>