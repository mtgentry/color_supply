<template lang="pug">
  #favoriteSignup
    p.title Sign Up to Save Favorites
    p.subtitle Save the palettes you love and find them here anytime.
    v-btn#button(color="primary" flat block @click="signUp") Create Free Account
    p.login Already have an account? !{` `}
      a(@click="login") Log in
  DialogsSignUp
  DialogsLogin
</template>

<script setup>
const dialogStore = useDialogStore()
const {changeSignUpForm, changeLoginForm, changeSource} = dialogStore
const signUp = () => {
  changeSignUpForm(true, false, true)
}
const login = () => {
  changeSource('favorite')
  changeLoginForm(true)
}

</script>

<style lang="sass" scoped>
#favoriteSignup
  display: flex
  flex-direction: column
  align-items: center
  text-align: center
  max-width: 260px
  margin: 0 auto
  padding: 80px 8px 0

  .title
    font-size: 1.25rem
    font-weight: 600
    line-height: 1.25
    letter-spacing: -0.2px
    color: var(--color2)
    text-wrap: balance
    margin-bottom: 8px

  .subtitle
    font-size: 0.875rem
    font-weight: 400
    line-height: 1.5
    color: var(--color3)
    text-wrap: balance
    margin-bottom: 24px

  #button
    // !important: assets/css/custom.sass forces .v-btn--size-default to 32px!important
    height: 44px!important
    border-radius: 8px
    background-color: var(--color1)!important
    font-size: 0.9375rem
    font-weight: 500
    letter-spacing: 0
    text-transform: none

  .login
    margin-top: 16px
    font-size: 0.8125rem
    color: var(--color3)
    a
      color: var(--color1)
      font-weight: 500
      cursor: pointer
      text-decoration: none
      &:hover
        text-decoration: underline
</style>
