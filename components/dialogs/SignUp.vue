<template lang="pug">
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
</template>

<script setup>
const dialogStore = useDialogStore()
const { signUpForm, signUpFormPersistent } = storeToRefs(dialogStore)
const { status } = useAuth()
const was_logged = useCookie('was_logged')
if (status.value === 'unauthenticated') {
  const user = await fetch('/session/')
  if (user.restricted && !was_logged.value) {
    dialogStore.changeSignUpForm(true, true)
  }
}
</script>