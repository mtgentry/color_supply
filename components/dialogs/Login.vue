<template lang="pug">
    DialogsAuthShell(v-model="loginForm")
      AuthLogin(source="explore")
        template(#header)
          div.text-center
            h1(v-if="source === 'favorite'") Log in to Save Favorites
            h1(v-else-if="source === 'login'") Log In to Your Account
            h1(v-else) Log In to Your Account
            h2(v-if="source === 'favorite'") Log in now to save and access your favorite color palettes anytime.
            h2(v-else-if="source === 'login'") Welcome back! Access your saved palettes and continue creating.
            h2(v-else) Log in now to save and access your favorite color palettes anytime.
        template(#footer)
          div#signupFooter.text-center
            p
              nuxt-link(to="/reset") Forgot password?
            p Don’t have an account? !{` `}
              a(@click="signUp") Create an account
            p#terms By continuing you agree to our Terms of Service and Privacy Policy.
</template>

<script setup>
const dialogStore = useDialogStore()
const { loginForm, source } = storeToRefs(dialogStore)
const { status } = useAuth()
if (status.value === 'unauthenticated') {
  const was_logged = useCookie('was_logged')
  if (was_logged.value) {
    // dialogStore.changeLoginForm(true)
  }
}

const signUp = () => {
  dialogStore.changeLoginForm(false)
  dialogStore.changeSignUpForm(true)
}
</script>
