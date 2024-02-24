<template lang="pug">
  div.form
    h1 Sign up to access more colors
    v-form
      v-text-field(v-model="name" label="Name" required placeholder="Sara" variant="outlined")
      v-text-field(v-model="email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined")
      v-text-field#password(v-model="password" label="Password" required placeholder="Colorfan19#"  variant="outlined" hint="At least 8 characters, with a number or symbol" )
      v-btn#submit(color="primary" text @click="signup") Create Free Account
      div.text-center
        p By continuing you agree to our Terms of Service and Privacy Policy.
        v-divider
        p Already have an account? Log in
</template>

<script setup>
const name = ref('')
const email = ref('')
const password = ref('')
const signup = () => {
  console.log('Signing up...')
}
definePageMeta({
  layout: 'auth',
})
</script>

<style scoped lang="sass">
:deep(#password-messages)
  color: var(--color1)!important
</style>

