<template lang="pug">
  #favoriteSignup
    p.title Sign Up to Save Favorites
    p.subtitle Sign up now to save and access your favorite color palettes anytime.
    v-btn#button(color="primary" width="226" flat @click="signUp") Create Free Account
  DialogsSignUp
</template>

<script setup>
const {changeSignUpForm} = useDialogStore()
const signUp = () => {
  changeSignUpForm(true, false, true)
}

</script>

<style lang="sass">
#favoriteSignup
  padding: 96px 24px 0 24px

  .title
    font-size: 1.25rem
    font-style: normal
    font-weight: 500
    line-height: normal
    letter-spacing: 0.4px
    text-align: center
    padding-bottom: 16px

  .subtitle
    color: var(--Color-Supply-Color-2, #1D1E20)
    text-align: center
    font-size: 0.75rem
    font-style: normal
    font-weight: 400
    line-height: normal
    padding-bottom: 32px
</style>