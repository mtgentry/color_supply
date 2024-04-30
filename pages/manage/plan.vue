<template lang="pug">
  ManageLayout
    v-row
      v-col#toggle.centered(md="12")
        v-btn-toggle(v-model="cycle" color="primary" mandatory)
          v-btn( v-for="cycle in cycles" :key="cycle" :value="cycle") {{capitalized(cycle)}}
      v-col.centered(md="3" v-for="plan in plans" :key="plan.name")
        ManagePlan(:plan="plan" :cycle="cycle")

</template>

<script setup>
const planStore = usePlanStore()
const {plans} = storeToRefs(planStore)
const cycles = ['monthly', 'yearly']
const cycle = ref('monthly')
</script>

<style scoped lang="sass">
#toggle
  margin: 128px 0 64px 0
</style>