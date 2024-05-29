<template lang="pug">
  v-app-bar(elevation="0" app)
    template(v-slot:prepend)
      img#logo(src="/img/rainbow.svg" height="40" contain)
    template(v-slot:append)
      div(v-if="status === 'unauthenticated'")
        v-btn#login(@click="login") Login
        v-btn#signup.ml-3(to="/signup"  color="primary" ) Sign Up
      div.centered(v-else)
        v-menu(open-on-hover open-delay="0")
          template(v-slot:activator="{ props }")
            img.clickable(src="/img/icons/user.svg" height="40" v-bind="props")
          v-card#popup
            v-card-text
              div.profile {{data.name }}
              div.profile#email {{data.email }}
              v-btn#plan(color="primary" variant="outlined" to="/manage/plan") {{ data.plan.name }} Plan
              v-divider
              v-list
                v-list-item(to="/manage/general") Manage account
                v-list-item
                  .d-flex.align-center
                    IconsHeart.mr-1.mb-1
                    span My Likes
                v-list-item Bug report & feedback
                v-list-item(@click="logout") Log Out

    v-toolbar-title
      nuxt-link(to="/explore") Explore
      nuxt-link(to="/create") Create
      nuxt-link(to="/visualize") Visualize
</template>

<script setup>
const { status, signOut, data } = useAuth()
const dialogStore = useDialogStore()
const {changeLoginForm} = dialogStore
const snackbar = useSnackbar()
const login = () => {
  changeLoginForm(true)
}
const logout = () => {
  signOut()
  snackbar.add({
    type: 'success',
    text: 'Logged out successfully',
  })
}
</script>

<style scoped lang="sass">
  #logo
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

  #popup
    font-size: 14px
    .v-card-text
      padding: 25px
    #email
      color: var(--color3)
    #plan
      width: 100%
      margin-top: 16px
      :deep(.v-btn__overlay)
        // disable active page color
        opacity: 0
    .v-divider
      margin: 26px 0 8px 0

    .v-list
      padding: 0
      .v-list-item
        padding: 0
      .v-list-item--density-default.v-list-item--one-line
        min-height: 36px

</style>