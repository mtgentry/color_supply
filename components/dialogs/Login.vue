<template lang="pug">
    v-dialog(max-width="510" v-model="loginForm")
      v-card
        v-card-text
          AuthLogin(source="explore")
            template(#header)
              div.text-center
                h1 Log in to Save Favorites
                h2 Log in now to save and access your favorite color palettes anytime.
            template(#footer)
              div#signupFooter.text-center
                p Don’t have an account?  !{` `}
                  nuxt-link(to="/signup") Create an account
                p#terms By continuing you agree to our Terms of Service and Privacy Policy.
</template>

<script setup>
const dialogStore = useDialogStore()
const { loginForm } = storeToRefs(dialogStore)
const { status } = useAuth()
if (status.value === 'unauthenticated') {
  const was_logged = useCookie('was_logged')
  if (was_logged.value) {
    dialogStore.changeLoginForm(true)
  }
}
</script>