<template lang="pug">
#invite.d-flex.flex-column
  h1 The easiest way to pick the perfect colors—at the lowest price you'll ever pay

  p Picking colors shouldn't be this hard. But between complicated color theory rules, endless choices, and the nagging feeling that you might not have picked the right one, it often feels like guesswork.You're stuck second-guessing every shade, tweaking endlessly, and hoping it just works.

  p Imagine knowing exactly which colors work together—with zero stress. No overthinking, no struggling with color wheels, and no more wondering if your palette is clashing.

  p That's exactly why we built Color Supply—to take the guesswork out of color. It helps you instantly create harmonious, professional-looking color palettes, without needing a degree in design.

  p And here's the best part: because we're still improving it, we're offering a limited-time early adopter price.

  p It's already powerful, easy to use, and saving designers time—and it's only getting better. 

  p But after three days, the doors close...

  v-btn#button(color="primary" width="226" flat @click="signUp")
    | Get Early Access Now

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
const { changeSignUpForm } = dialogStore

const signUp = () => {
  dialogStore.changeSource('promo')  // Set the source to 'promo'
  changeSignUpForm(true, false, false)  // Show the form
}
</script>

<style lang="sass" scoped>
#invite
  max-width: 438px
  min-height: 100vh
  display: flex
  flex-direction: column
  justify-content: center
  padding: 2rem 0
  
  @media (max-width: 768px)
    min-height: auto
    max-width: none  // Remove max-width constraint
    width: auto     // Let it fill available space
    padding: 2rem 1rem  // Reduced side padding
    justify-content: flex-start

  h1
    font-size: 30px
    font-style: normal
    font-weight: 700
    line-height: normal

  p
    padding-bottom: 20px
    font-size: 14px
    font-style: normal
    font-weight: 500
    line-height: normal
    letter-spacing: 0.28px

  #button
    background-color: var(--color1) !important
    margin-top: 20px
    font-size: 16px
    font-style: normal
    font-weight: 300
    line-height: normal
    letter-spacing: 0.32px
    text-transform: none
</style>