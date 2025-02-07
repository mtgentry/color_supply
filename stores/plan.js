import {defineStore} from 'pinia'

export const usePlanStore = defineStore('plan', () =>{
  const plans = ref([])
  const selectedPlan = ref(null)
  const selectPlan = (plan) => {
    selectedPlan.value = plan
  }
  const selectedInterval = ref('month')
  const selectInterval = (cycle) => {
    selectedInterval.value = cycle
  }
  const fetchPlans = async (url='/plans/') => {
    plans.value = await fetch(url)
    if (plans.value) {
      plans.value.sort((a, b) => a.metadata.order - b.metadata.order)
    }
  }
  return {
    plans,
    selectedPlan,
    selectPlan,
    selectedInterval,
    selectInterval,
    fetchPlans
  }
})