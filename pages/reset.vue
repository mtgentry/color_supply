<template lang="pug">
  div.form
    h1 Password Reset
    v-form(@submit.prevent="reset")
      v-text-field(v-model="state.email" label="Email" required email="sara.smith@gmail.com"  variant="outlined"
        :error-messages="v$.email.$errors.map(e => e.$message)" @blur="v$.email.$touch")
      v-btn#submit(color="primary" type="submit") Reset
      div#description
        p Want to log in? !{` `}
          nuxt-link(to="/login") Log in
        p Don’t have an account? !{` `}
          nuxt-link(to="/signup") Sign up
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import {required, helpers, email} from '@vuelidate/validators'
const snackbar = useSnackbar()
definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/explore' },
  layout: 'auth',
})
useHead({
  title: 'Password Reset Request',
})

const error_message = ref('')
const initialState = {
  email: '',
}

const state = reactive({
  ...initialState,
})

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Email must be valid', email),
  },
}
const v$ = useVuelidate(rules, state)
const reset = async () => {
  try {
    await fetch('reset/', 'post', { email: state.email})
  } catch (error) {
    error_message.value = error.data.detail
    // console.error(error)
  }
  snackbar.add({
    type: 'success',
    text: 'Check your email for a password reset link.'
  })

}
</script>
