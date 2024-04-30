<template lang="pug">
  ManageLayout
    v-container
      v-row.plans
        v-col#toggle.centered.flex-row(md="12")
          v-btn(v-for="cycle in cycles" :key="cycle" flat :variant="selected_cycle === cycle ? undefined : 'outlined'"
            :color="selected_cycle === cycle ? 'primary': 'gray'"
          @click="selected_cycle=cycle") {{capitalized(cycle)}}
        v-col.centered(md="3" v-for="plan in plans" :key="plan.name")
          ManagePlan(:plan="plan" :cycle="selected_cycle")

</template>

<script setup>
const planStore = usePlanStore()
const {plans} = storeToRefs(planStore)
const cycles = ['monthly', 'yearly']
const selected_cycle = ref('monthly')
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