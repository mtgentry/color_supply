<template lang="pug">
  #invite.d-flex.flex-column
    h1 Infinite Colors. Lifetime Access.
    p You’ve been selected to experience the newest Color Supply with free lifetime access!
    p This invite is our way of thanking you for sharing and supporting Color Supply. You’ll have access to all premium features—forever.
    p The sign-up link is just for you, so please keep it private.
    v-btn#button(color="primary" width="226" flat @click="signUp") Get Unlimited Access
  DialogsSignUp
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/palettes' },
  layout: 'auth',
})
useHead({
  title: 'Private Invite',
})
const dialogStore = useDialogStore()
const {changeSignUpForm} = dialogStore
const signUp = () => {
  changeSignUpForm(true, false, true)
}
</script>

<style lang="sass" scoped>
#invite
  max-width: 438px

  h1
    font-size: 30px
    font-style: normal
    font-weight: 700
    line-height: normal
    margin-top: 30px

  p
    padding-bottom: 20px
    font-size: 17px
    font-style: normal
    font-weight: 400
    line-height: 130%
    letter-spacing: 0.28px

  #button
    background-color: var(--color1)!important
    margin-top: 20px
    font-size: 16px
    font-style: normal
    font-weight: 400
    line-height: normal
    letter-spacing: 0.32px
    text-transform: none

</style>