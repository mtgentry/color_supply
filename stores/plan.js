import {defineStore} from 'pinia'

export const usePlanStore = defineStore('plan', () =>{
  const plans = ref([])
  const selectedPlan = ref(null)
  const selectPlan = (plan) => {
    selectedPlan.value = plan
  }
  const selectedCycle = ref('monthly')
  const selectCycle = (cycle) => {
    selectedCycle.value = cycle
  }
  const fetchPlans = async () => {
    plans.value = await fetch('/plans/')
  }
  return {
    plans,
    selectedPlan,
    selectPlan,
    selectedCycle,
    selectCycle,
    fetchPlans
  }
})