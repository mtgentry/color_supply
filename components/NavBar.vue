<template lang="pug">
  v-app-bar(elevation="0" app)
    template(v-slot:prepend)
      img(src="/img/rainbow.svg" height="40" contain)
    template(v-slot:append)
      v-btn#login(to="/login") Login
      v-btn#signup.ml-3(to="/signup"  color="primary") Sign Up
    v-toolbar-title
      nuxt-link(to="/explore") Explore
      nuxt-link(to="/create") Create
      nuxt-link(to="/visualize") Visualize
</template>

<script setup>

</script>

<style scoped lang="sass">
  img
    height: 26px
    padding: 0 20px
  .v-toolbar
    border-bottom: var(--color5) 1px solid
  #login
    border: var(--color3) 1px solid
  #signup
    background-color: var(--color1)
    color: var(--color6)!important

  .v-toolbar-title
    a
      color: var(--color3)
      text-decoration: none
      font-size: 17px
      font-weight: 400
      margin-right: 20px
      &:hover
        color: var(--color1)

      &.router-link-active
        border-bottom: var(--color3) 1px solid

        &:hover
          color: var(--color1)
          border-bottom: var(--color1) 1px solid
</style>