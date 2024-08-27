<template lang="pug">
    v-dialog(max-width="510" v-model="signUpForm" :persistent="signUpFormPersistent")
      v-card
        v-card-text
          AuthSignUp(source="explore")
            template(#header)
              div.text-center
                h1(v-if="source === 'favorite'")  Sign Up to Save Favorites
                h2(v-if="source === 'favorite'")  Sign up now to save and access your favorite color palettes anytime.
                h1(v-if="source === 'login'") Get Started for Free
                h2(v-if="source === 'login'") Sign up for free to save your palettes. Upgrade for advanced features.
            template(#footer)
              div#signupFooter.text-center
                p Already have an account?  !{` `}
                  a(@click="login") Log in
                p.pb-2#terms By continuing you agree to our Terms of Service and Privacy Policy.
</template>

<script setup>
const dialogStore = useDialogStore()
const { signUpForm, signUpFormPersistent, source } = storeToRefs(dialogStore)
const { status } = useAuth()
const was_logged = useCookie('was_logged')
if (status.value === 'unauthenticated') {
  const user = await fetch('/session/')
  if (user.restricted && !was_logged.value) {
    // TODO: adjust form
    // dialogStore.changeSignUpForm(true, true)
  }
}

const login = () => {
  dialogStore.changeSignUpForm(false)
  dialogStore.changeLoginForm(true)
}
</script>

<style lang="sass" scoped>
a
  color: var(--color1)
  cursor: pointer
  text-decoration: none

:deep(.v-input:not(.v-input--error) #password-messages)
  color: var(--color1)!important
</style>
