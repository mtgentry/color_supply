<template lang="pug">
  div.form
    h1 Password Reset
    v-form(@submit.prevent="reset")
      v-text-field#password(v-model="state.password" label="New Password" :type="showPassword ? 'text' : 'password'" required placeholder="Colorfan19#"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        :error-messages="v$.password.$errors.map(e => e.$message)" @blur="v$.password.$touch" autocomplete="new-password")
      v-btn#submit(color="primary" type="submit") Change Password
      div#description
        p Want to log in? !{` `}
          nuxt-link(to="/login") Log in
        p Don’t have an account? !{` `}
          nuxt-link(to="/signup") Sign up
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
const route = useRoute()
const router = useRouter()

definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/explore' },
  layout: 'auth',
  title: 'Password Reset',
})
useHead({
  title: 'Password Reset',
})
const key = route.query.key

if (!key) {
  router.push('/explore')
}

const error_message = ref('')
const initialState = {
  password: '',
}

const state = reactive({
  ...initialState,
})

const showPassword = ref(false)

const rules = {
    password: {
    required: helpers.withMessage('Password is required', required),
    server_error: helpers.withMessage(() =>`${error_message.value}`, (value) => {
      return !error_message.value.length
    }),
  },
}
const v$ = useVuelidate(rules, state)
const reset = async () => {
  try {
    await fetch('reset_password/', 'post', { password: state.password, key })
    await router.push('/login')
  } catch (error) {
    if (error.data.key) {
      error_message.value = 'Invalid request. Please, reset your password again.'
    } else {
      error_message.value = error.data.password
    }
  }

}
</script>
