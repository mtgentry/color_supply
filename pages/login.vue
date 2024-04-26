<template lang="pug">
  div.form
    h1 Log in
    v-form(@submit.prevent="login")
      v-text-field(v-model="state.email" label="Email" required email="sara.smith@gmail.com"  variant="outlined"
        :error-messages="v$.email.$errors.map(e => e.$message)" @blur="v$.email.$touch")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required placeholder="Colorfan19#"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        :error-messages="v$.password.$errors.map(e => e.$message)" @blur="v$.password.$touch")
      v-btn#submit(color="primary" type="submit") Continue
      div#description
        p Forgot password? Reset
        p Don’t have an account? !{` `}
          nuxt-link(to="/signup") Sign up
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
const { signIn, token, data, status } = useAuth()
const error_message = ref('')
const initialState = {
  email: '',
  password: '',
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
    server_error: helpers.withMessage(() =>`${error_message.value}`, (value) => {
      return !error_message.value.length
    }),
  },
}
const v$ = useVuelidate(rules, state)
const login = async () => {
  try {
    await signIn({ email: state.email, password: state.password }, {callbackUrl: '/explore'})
  } catch (error) {
    error_message.value = error.data.detail
    // console.error(error)
  }
}
definePageMeta({
  layout: 'auth',
})
</script>
