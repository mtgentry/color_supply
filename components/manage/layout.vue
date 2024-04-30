<template lang="pug">
  v-row
    v-col#nav.pa-0(cols="2")
      v-list
        v-list-item
          nuxt-link(to="general") General
        v-list-item
          nuxt-link(to="") Password
        v-list-item
          nuxt-link(to="plan") Plan
        v-list-item
          nuxt-link(to="") Billing
      div.pa-5.centered
        v-btn(color="red" variant="outlined" @click="signOut") Delete Account
    v-col#content.pa-0(cols="10")
      slot
</template>


<style scoped lang="sass">
#nav
  background-color: var(--color6)
  height: calc(100vh - 64px)
  display: flex
  flex-direction: column
  justify-content: space-between

.v-list
  background-color: var(--color6)

#content
  background-color: var(--color7)

</style>