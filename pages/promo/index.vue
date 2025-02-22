<template lang="pug">
  #invite.d-flex.flex-column
    h1 The easiest way to pick the perfect colors—at the lowest price you'll ever pay
    p Picking colors shouldn't be this hard. But between complicated color theory rules, endless choices, and the nagging feeling that you might not have picked the right one, it often feels like guesswork.You're stuck second-guessing every shade, tweaking endlessly, and hoping it just works.
    p Imagine knowing exactly which colors work together—with zero stress. No overthinking, no struggling with color wheels, and no more wondering if your palette is clashing.
    p That's exactly why I built Color Supply—to take the guesswork out of color. It helps you instantly create harmonious, professional-looking color palettes, without needing a degree in design.
    p And here's the best part: because we're still improving it, I'm offering a limited-time early adopter price.
    p It's already powerful, easy to use, and saving designers time—and it's only getting better.
    p But after three days, the doors close...
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
dialogStore.changeSource('promo')
const {changeSignUpForm} = dialogStore
const signUp = () => {
  changeSignUpForm(true, false, false, true)
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
    margin-bottom: 15px

  p
    padding-bottom: 20px
    font-size: 17px
    font-style: normal
    font-weight: 400
    line-height: 130%
    letter-spacing: 0.28px

</style>