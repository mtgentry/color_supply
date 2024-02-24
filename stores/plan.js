import { defineStore } from 'pinia'
export const usePlanStore = defineStore('plan', () =>{
  const plans = ref([
    { id: 1, name: 'Basic', price: 10, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae lacus nisi. Maecenas suscipit ut nibh in dictum. Vivamus metus nunc, sagittis ut faucibus vel, semper id ligula.'},
    { id: 2, name: 'Pro', price: 20, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae lacus nisi. Maecenas suscipit ut nibh in dictum. Vivamus metus nunc, sagittis ut faucibus vel, semper id ligula.'},
    { id: 3, name: 'Enterprise', price: 50, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae lacus nisi. Maecenas suscipit ut nibh in dictum. Vivamus metus nunc, sagittis ut faucibus vel, semper id ligula.'},
  ])
  const selectedPlan = ref(null)
  const selectPlan = (plan) => {
    selectedPlan.value = plan
  }
  return {
    plans,
    selectedPlan,
    selectPlan
  }
})