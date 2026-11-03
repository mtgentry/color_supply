<template lang="pug">
  v-app-bar(elevation="0" app absolute)
    template(v-slot:prepend)
      nuxt-link(to="/palettes")
        img#logo(src="/img/rainbow.svg" height="40" contain)
    template(v-slot:append)
      div(v-if="status === 'unauthenticated'")
        v-btn#login(@click="login") Login
        v-btn#signup.ml-3(@click="handleSignUp" color="primary") Sign Up
      div.centered(v-else)
        v-menu(open-on-hover open-delay="0" offset="10")
          template(v-slot:activator="{ props }")
            img.clickable(src="/img/icons/user.svg" height="40" v-bind="props")
          v-card#popup(elevation="0")
            v-card-text
              div#name {{data.name }}
              div#email {{data.email }}
              v-btn#plan(color="primary" variant="outlined" to="/manage/plan") {{ data.plan.name }} Plan
              v-divider
              v-list
                v-list-item(:ripple="false" to="/favorites")
                    .d-flex.align-center
                      IconsHeart.mr-1
                      span Favorites
                v-list-item(to="/manage/general" :ripple="false") Manage account
                v-list-item(@click="logout" :ripple="false") Log Out
    v-toolbar-title
      nuxt-link(to="/palettes") Palettes
      nuxt-link(to="/mix") Mix
      nuxt-link(to="/visualize") Visualize
  #mobileAuth(v-if="status === 'unauthenticated'")
    div.half
      v-btn#signup(@click="handleSignUp" color="primary" width="100%") Sign Up
    div.half
      v-btn#login(@click="login" width="100%") Login
</template>

<script setup>
const { status, signOut, data } = useAuth()
const colorStore = useColorStore()
const dialogStore = useDialogStore()
const { changeLoginForm } = dialogStore
const { handleSignUp } = useSignUp()  // Using the new composable

// Keep login separate since it's navbar specific
const login = () => {
  changeLoginForm(true)
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
a
  text-decoration: none!important

  &:hover
    color: var(--color1) !important
  &:visited
    color: var(--color3)
.router-link-active
  color: var(--color1) !important
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

  // links are position: fixed, so each needs its own left (17px gaps): Palettes, Mix, Visualize
  :nth-child(2)
    left: 190px
  :nth-child(3)
    left: 236px

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
    display: flex

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
  #name
    color: var(--color11)
    font-size: 14px
    font-style: normal
    font-weight: 400
    line-height: normal
  #email
    color: var(--color3)
    font-size: 14px
    font-style: normal
    font-weight: 400
    line-height: normal

  #plan
    width: 100%
    margin-top: 16px
    color: var(--color1)
    text-align: center
    font-size: 12px
    font-style: normal
    font-weight: 500
    line-height: normal
    letter-spacing: 0.24px
    text-transform: none
    :deep(.v-btn__overlay)
      // disable active page color
      opacity: 0
  .v-divider
    margin: 26px 0 8px 0

  .v-list
    padding: 0
    .v-list-item
      font-size: 14px
      font-style: normal
      font-weight: 400
      line-height: 245%
      padding: 0
      color: var(--color11)
      cursor: pointer
      &:hover
        color: var(--color1)
      :deep(.v-list-item__overlay)
        display: none
    .v-list-item--density-default.v-list-item--one-line
      min-height: 36px

:deep(.v-toolbar__append)
  display: none
  @media (min-width: 960px)
    display: flex

#mobileAuth
  display: none
  @media (max-width: 960px)
    position: fixed
    bottom: 0
    display: flex
    justify-content: space-between
    z-index: 1000
    width: 100vw
    padding: 80px 0px 18px 0px
    background-image: url('/img/white-gradient.svg')
    background-size: cover
  .half
    width: 50%
    padding-right: 24px
    &:first-child
      padding-left: 24px
</style>