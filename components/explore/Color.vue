<template lang="pug">
  v-tabs(v-model='colorTab' dense  align-tabs="center" )
    v-tab(value='color')
      svg(width='23' height='24' viewbox='0 0 23 24' fill='none' xmlns='http://www.w3.org/2000/svg')
        g
          rect(id='active 4' y='0.96875' width='23' height='23' rx='4' fill='white')
          circle(id='Ellipse 200' cx='15.5' cy='8.96875' r='2.625' stroke='#788092' stroke-width='0.75')
          circle(id='Ellipse 201' cx='7.5' cy='8.96875' r='2.625' stroke='#788092' stroke-width='0.75')
          circle(id='Ellipse 202' cx='7.5' cy='16.9688' r='2.625' stroke='#788092' stroke-width='0.75')
          circle(id='Ellipse 203' cx='15.5' cy='16.9688' r='2.625' stroke='#788092' stroke-width='0.75')
    v-tab(value='wheel')
      svg(width='23' height='24' viewbox='0 0 23 24' fill='none' xmlns='http://www.w3.org/2000/svg')
        g
          rect(id='active 1' y='0.96875' width='23' height='23' rx='4' fill='white')
          path#Vector(d='M17.0596 6.39862C17.0596 6.38048 17.0414 6.38048 17.0231 6.36235C17.0049 6.34422 17.0049 6.34422 16.9866 6.32608C15.5076 4.87542 13.4626 3.96875 11.2167 3.96875C8.97078 3.96875 6.92574 4.87542 5.44674 6.32608C5.42848 6.34422 5.41022 6.34422 5.41022 6.36235C5.41022 6.38048 5.39196 6.38048 5.3737 6.39862C3.91296 7.86742 3 9.89835 3 12.1287C3 14.3591 3.91296 16.3901 5.3737 17.8589C5.3737 17.877 5.39196 17.877 5.41022 17.8952C5.42848 17.9133 5.42848 17.9133 5.44674 17.9314C6.92574 19.3821 8.97078 20.2887 11.2167 20.2887C13.4626 20.2887 15.5076 19.3821 16.9866 17.9314C17.0049 17.9133 17.0231 17.9133 17.0231 17.8952C17.0231 17.877 17.0414 17.877 17.0596 17.8589C18.5204 16.3901 19.4333 14.3591 19.4333 12.1287C19.4333 9.89835 18.5204 7.86742 17.0596 6.39862ZM18.703 11.7661H14.6677C14.5946 11.0951 14.3207 10.4605 13.919 9.97088L16.7675 7.14208C17.8813 8.37515 18.6117 9.98902 18.703 11.7661ZM11.5819 4.69408C13.3713 4.78475 14.9963 5.49195 16.238 6.61622L13.3895 9.44502C12.8783 9.04608 12.2574 8.77408 11.5819 8.70155V4.69408ZM10.8515 4.69408V8.70155C10.1759 8.77408 9.53681 9.04608 9.04381 9.44502L6.19537 6.61622C7.437 5.51008 9.06207 4.78475 10.8515 4.69408ZM5.66585 7.14208L8.5143 9.97088C8.11259 10.4786 7.8387 11.0951 7.76567 11.7661H3.73037C3.82167 9.98902 4.55204 8.37515 5.66585 7.14208ZM3.73037 12.4914H7.76567C7.8387 13.1624 8.11259 13.797 8.5143 14.2866L5.66585 17.1154C4.55204 15.8823 3.82167 14.2685 3.73037 12.4914ZM10.8515 19.5634C9.06207 19.4727 7.437 18.7656 6.19537 17.6413L9.04381 14.8125C9.55507 15.2114 10.1759 15.4834 10.8515 15.556V19.5634ZM8.47778 12.1287C8.47778 10.6237 9.70115 9.40875 11.2167 9.40875C12.7322 9.40875 13.9556 10.6237 13.9556 12.1287C13.9556 13.6338 12.7322 14.8488 11.2167 14.8488C9.70115 14.8488 8.47778 13.6338 8.47778 12.1287ZM11.5819 19.5634V15.556C12.2574 15.4834 12.8965 15.2114 13.3895 14.8125L16.238 17.6413C14.9963 18.7474 13.3713 19.4727 11.5819 19.5634ZM16.7675 17.1154L13.919 14.2866C14.3207 13.7789 14.5946 13.1624 14.6677 12.4914H18.703C18.6117 14.2685 17.8813 15.8823 16.7675 17.1154Z' fill='#788092')
        defs
          rect(width='23' height='23' fill='white' transform='translate(0 0.96875)')
    v-tab(value='list')
      svg(width='23' height='23' viewbox='0 0 23 23' fill='none' xmlns='http://www.w3.org/2000/svg')
        g
          rect(id='active 2' width='23' height='23' rx='4' fill='white')
          path(id='Ellipse 135' d='M16.75 8.625C16.75 8.96829 16.4277 9.24694 16.0287 9.24997L6.72785 9.25C6.32587 9.25 6 8.97018 6 8.625C6 8.27982 6.32587 8 6.72785 8L16.0274 8.00002C16.427 8.00245 16.75 8.28133 16.75 8.625Z' fill='#788092')
          path(id='Ellipse 136' d='M16.75 14.125C16.75 14.4683 16.4277 14.7469 16.0287 14.75L6.72785 14.75C6.32587 14.75 6 14.4702 6 14.125C6 13.7798 6.32587 13.5 6.72785 13.5L16.0274 13.5C16.427 13.5025 16.75 13.7813 16.75 14.125Z' fill='#788092')
          path(id='Ellipse 137' d='M16.75 11.375C16.75 11.7183 16.4277 11.9969 16.0287 12L6.72785 12C6.32587 12 6 11.7202 6 11.375C6 11.0298 6.32587 10.75 6.72785 10.75L16.0274 10.75C16.427 10.7525 16.75 11.0313 16.75 11.375Z' fill='#788092')
  v-window(v-model='colorTab')
    v-window-item(value='color' transition="none" reverse-transition="none")
      ExploreHarmonyColors
    v-window-item(value='wheel' transition="none" reverse-transition="none")
      ExploreHarmony(v-model="harmony").px-5
    v-window-item(value='list'  transition="none" reverse-transition="none")
      ExploreHarmonyList

</template>

<script setup>
const colorTab = defineModel()
const filterStore = useFilterStore()
const { harmony, colors } = storeToRefs(filterStore)

watch(colorTab, (value, oldValue) => {
  if (oldValue === 'list') {
    if (harmony.value) {
      filterStore.changeFilter(harmony, null)
    }
  } else if (oldValue === 'color') {
    if (colors.value.length > 0) {
      filterStore.changeFilter(colors, [])
    }
  }
})
</script>

<style scoped lang="sass">

:deep(.v-slide-group-item--active)
  svg
    rect
      fill: var(--color10)
    circle
      stroke: var(--color1)
    path
      fill: var(--color1)

:deep(.v-tab.v-tab.v-btn)
  min-width: 0!important



:deep(.v-tab__slider)
  opacity: 0!important

:deep(.v-btn--size-default)
  padding: 0!important
</style>