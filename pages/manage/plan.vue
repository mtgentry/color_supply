<template lang="pug">
  ManageLayout
    v-container
      v-row.plans
        v-col#toggle.centered.flex-row(md="12")
          v-btn(v-for="interval in intervals" :key="interval" flat :variant="selected_interval === interval ? undefined : 'outlined'"
            :color="selected_interval === interval ? 'primary': 'gray'"
          @click="selected_interval=interval") {{capitalized(interval)}}ly
        v-col.centered(md="3" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan" :interval="selected_interval")

</template>

<script setup>
const planStore = usePlanStore()
const {plans} = storeToRefs(planStore)
const intervals = ['month', 'year']
const selected_interval = ref('month')
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