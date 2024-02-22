<template lang="pug">
  div.form
    h1 Sign up to access more colors
    v-form
      v-text-field(v-model="name" label="Name" required placeholder="Sara" variant="outlined")
      v-text-field(v-model="email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined")
      v-text-field#password(v-model="password" label="Password" required placeholder="Colorfan19#"  variant="outlined" hint="At least 8 characters, with a number or symbol" )
      v-btn#submit(color="primary" text @click="signup") Create Free Account
      div#terms By continuing you agree to our Terms of Service and Privacy Policy.
      v-divider
      div#login Already have an account? Log in
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
h1
  margin-bottom: 22px
.form
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  height: 100%
  padding: 0 80px

#submit
  width: 100%
  margin-top: 14px
  text-transform: unset
  font-size: 16px
  letter-spacing: 0.32px

#terms
  padding: 10px 20px
  text-align: center

.v-divider
  margin: 27px 200px

:deep(#password-messages)
  color: var(--color1)!important

#login
  text-align: center
  font-size: 12px
  font-style: normal
  font-weight: 400
  line-height: normal
  letter-spacing: 0.24px
</style>