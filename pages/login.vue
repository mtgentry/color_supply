<template lang="pug">
  div.form
    h1 Log in
    v-form
      v-text-field(v-model="email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined")
      v-text-field#password(v-model="password" label="Password" type="password" required placeholder="Colorfan19#"
        variant="outlined")
      v-btn#submit(color="primary" text @click="login") Continue
      div#description
        p Forgot password? Reset
        p Don’t have an account? Sign up
</template>

<script setup>
const email = ref('')
const password = ref('')
const login = () => {
  console.log('Signing up...')
}
definePageMeta({
  layout: 'auth',
})
</script>
