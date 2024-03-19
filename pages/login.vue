<template lang="pug">
  div.form
    h1 Log in
    v-form
      v-text-field(v-model="state.email" label="Email" required email="sara.smith@gmail.com"  variant="outlined"
      :error-messages="v$.email.$errors.map(e => e.$message)" @blur="v$.email.$touch")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required placeholder="Colorfan19#"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        :error-messages="v$.password.$errors.map(e => e.$message)" @blur="v$.password.$touch")
      v-btn#submit(color="primary" @click="login") Continue
      div#description
        p Forgot password? Reset
        p Don’t have an account? !{` `}
          nuxt-link(to="/signup") Sign up
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const initialState = {
  email: '',
  password: null,
}

const state = reactive({
  ...initialState,
})

const showPassword = ref(false)

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Email must be valid', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
  },
}
const v$ = useVuelidate(rules, state)
const login = () => {
  console.log('Signing up...')
}
definePageMeta({
  layout: 'auth',
})
</script>
