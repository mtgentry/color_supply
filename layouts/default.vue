<template lang="pug">
  v-app(dark)
    NavBar
    v-main
      v-container(fluid)
        slot
      v-dialog(max-width="510" v-model="signUpForm" :persistent="signUpFormPersistent")
        v-card
          v-card-text
            AuthSignUp(source="explore")
              template(#header)
                div.text-center
                  h1 Sign Up to Save Favorites
                  h2 Sign up now to save and access your favorite color palettes anytime.
              template(#footer)
                div#signupFooter.text-center
                  p Already have an account?  !{` `}
                    nuxt-link(to="/login") Log in
                  p#terms By continuing you agree to our Terms of Service and Privacy Policy.
    NuxtSnackbar
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Color Supply` : 'Color Supply';
  }
})
const dialogStore = useDialogStore()
const { signUpForm, signUpFormPersistent } = storeToRefs(dialogStore)
const { status } = useAuth()
if (status.value === 'unauthenticated') {
  const user = await fetch('/session/')
  if (user.restricted) {
    dialogStore.changeSignUpForm(true, true)
  }
}

</script>

<style lang="sass">

.v-application
  background-color: var(--color6)

.v-btn
  font-size: 14px
  font-style: normal
  font-weight: 500
  line-height: normal
  letter-spacing: 0.28px
  text-transform: none

.v-row
  margin: -16px

h2
  font-size: 22px
  font-weight: 400
  letter-spacing: 0.44px

.centered
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
</style>