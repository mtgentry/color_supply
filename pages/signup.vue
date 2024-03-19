<template lang="pug">
  div.form
    h1 Sign up to access more colors
    v-form
      v-text-field(v-model="state.name" label="Name" required placeholder="Sara" variant="outlined" :counter="10"
        :error-messages="v$.name.$errors.map(e => e.$message)" @blur="v$.name.$touch" @input="v$.name.$touch")
      v-text-field(v-model="state.email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined"
        :error-messages="v$.email.$errors.map(e => e.$message)"  @blur="v$.email.$touch")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required
      placeholder="Colorfan19#" :hint="!v$.password.$invalid ? '' : 'At least 8 characters, with a number or symbol'"  :error-messages="v$.password.$errors.map(e => e.$message)"
      variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
       @blur="v$.password.$touch")
      v-btn#submit(color="primary" text @click="signup") Create Free Account
      div.text-center
        p By continuing you agree to our Terms of Service and Privacy Policy.
        v-divider
        p Already have an account?  !{` `}
          nuxt-link(to="/login") Log in
</template>
<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength, helpers } from '@vuelidate/validators'

const initialState = {
  name: '',
  email: '',
  password: null,
}

const state = reactive({
  ...initialState,
})
const showPassword = ref(false)
const symbol = helpers.regex(/[^a-zA-Z0-9\s]/)
const number = helpers.regex(/[0-9]/)
const rules = {
  name: {
    required: helpers.withMessage('Name is required', required),
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Email must be valid', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: minLength(8),
    number: helpers.withMessage('Password must contain at least one number', number),
    symbol: helpers.withMessage('Password must contain at least one symbol', symbol),
  },
}

const v$ = useVuelidate(rules, state)

const signup = () => {
  console.log('Signing up...')
}
definePageMeta({
  layout: 'auth',
})
</script>

<style scoped lang="sass">
:deep(.v-input:not(.v-input--error) #password-messages)
  color: var(--color1)!important
</style>

