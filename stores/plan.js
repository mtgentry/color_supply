import { defineStore } from 'pinia'
export const usePlanStore = defineStore('plan', () =>{
  const plans = ref([
    { id: 1, name: 'Basic', price: {
        monthly: 3,
        yearly: 28,
        discount: 20
      }, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae lacus nisi. Maecenas suscipit ut nibh in dictum. Vivamus metus nunc, sagittis ut faucibus vel, semper id ligula.'},
    { id: 2, name: 'Pro', price: {
        monthly: 5,
        yearly: 48,
        discount: 20
      }, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae lacus nisi. Maecenas suscipit ut nibh in dictum. Vivamus metus nunc, sagittis ut faucibus vel, semper id ligula.'},
    { id: 3, name: 'Enterprise', price: {
        monthly: 10,
        yearly: 88,
        discount: 20
      }, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae lacus nisi. Maecenas suscipit ut nibh in dictum. Vivamus metus nunc, sagittis ut faucibus vel, semper id ligula.'},
  ])
  const selectedPlan = ref(null)
  const selectPlan = (plan) => {
    selectedPlan.value = plan
  }
  const selectedCycle = ref('yearly')
  const selectCycle = (cycle) => {
    selectedCycle.value = cycle
  }
  return {
    plans,
    selectedPlan,
    selectPlan,
    selectedCycle,
    selectCycle
  }
})