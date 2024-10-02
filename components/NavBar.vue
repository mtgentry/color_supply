<template lang="pug">
  v-app-bar(elevation="0" app)
    template(v-slot:prepend)
      nuxt-link(to="/palettes")
        img#logo(src="/img/rainbow.svg" height="40" contain)
    template(v-slot:append)
      div#feedback
        a(href="https://docs.google.com/document/d/1puqBgo1lgmq8Fw65LA1C8hWgwSEHo-FAW9K6CEBQutE/edit" target="_blank") Have ideas? We'd love to hear them.
      div(v-if="status === 'unauthenticated'")
        v-btn#login(@click="login") Login
        v-btn#signup.ml-3(@click="signUp" color="primary" ) Sign Up
      div.centered(v-else)
        v-menu(open-on-hover open-delay="0" offset="10")
          template(v-slot:activator="{ props }")
            img.clickable(src="/img/icons/user.svg" height="40" v-bind="props")
          v-card#popup(elevation="0")
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
      nuxt-link(to="/palettes") Palettes
      nuxt-link(to="/create") Create
      nuxt-link(to="/visualize") Visualize
</template>

<script setup>
const { status, signOut, data } = useAuth()
const dialogStore = useDialogStore()
const colorStore = useColorStore()
const {changeLoginForm, changeSignUpForm} = dialogStore
const snackbar = useSnackbar()
const login = () => {
  changeLoginForm(true)
}
const signUp = () => {
  changeSignUpForm(true)
}
const logout = () => {
  signOut()
  const route = useRoute()
  if (route.name.includes('manage')) {
    navigateTo('/palettes')
  }
  colorStore.unfavoritePalettes()
  snackbar.add({
    type: 'info',
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
  :deep(.v-toolbar-title__placeholder)
    height: 64px
    display: flex
    align-items: center

    :nth-child(2)
      left: 190px
    :nth-child(3)
      left: 260px

  .v-toolbar-title
    a
      color: var(--color3)
      text-decoration: none
      font-size: 17px
      font-weight: 400
      margin-right: 20px
      padding: 17px 0
      position: fixed
      top: 1px

      &:hover
        color: var(--color1)

      &.router-link-active
        border-bottom: var(--color1) 3px solid

        &:hover
          color: var(--color1)


  #popup
    border: var(--color4) 1px solid
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
#feedback
  font-size: 0.75rem
  font-weight: 400
  line-height: 16.38px
  text-align: center
  padding: 0 10px
  a
    text-decoration: unset!important

</style>