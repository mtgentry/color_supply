<template lang="pug">
  div.form
    v-window(v-model="tab")
      v-window-item(value="plan")
        UpgradeSelectPlan(@next="tab = 'credit'")
      v-window-item(value="credit")
        UpgradeBilling
</template>

<script setup>
const tab = ref('plan')
const planStore = usePlanStore()

planStore.fetchPlans()
definePageMeta({
  layout: 'auth',
})

</script>