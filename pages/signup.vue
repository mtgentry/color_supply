<template lang="pug">
  div.form
    h1 Sign up to access more colors
    v-form
      v-text-field(v-model="state.name" label="Name" required placeholder="Sara" variant="outlined" :counter="10"
        :error-messages="v$.name.$errors.map(e => e.$message)" @blur="v$.name.$touch" @input="v$.name.$touch")
      v-text-field(v-model="state.email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined"
        :error-messages="emailError || v$.email.$errors.map(e => e.$message)"  @blur="v$.email.$touch")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required
      placeholder="Colorfan19#" :hint="!v$.password.$invalid ? '' : 'At least 8 characters, with a number or symbol'"  :error-messages="v$.password.$errors.map(e => e.$message)"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        @blur="v$.password.$touch")
      v-btn#submit(color="primary" text @click="signup" :disabled="pending") Create Free Account
      div.text-center
        p By continuing you agree to our Terms of Service and Privacy Policy.
        v-divider
        p Already have an account?  !{` `}
          nuxt-link(to="/login") Log in
</template>
<script setup>
import {useVuelidate} from '@vuelidate/core'
import {email, helpers, minLength, required} from '@vuelidate/validators'

definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/explore' },
  layout: 'auth',
})

const {data} = useAuth()
if (data.value) {
  navigateTo('/explore')
}

const pending = ref(false)
const { signUp } = useAuth()
const initialState = {
  name: '',
  email: '',
  password: null,
}

const state = reactive({
  ...initialState,
})
const emailError = ref(null)
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

const signup = async () => {
  emailError.value = null
  pending.value = true
  await signUp(state, {callbackUrl: '/explore'}).catch((e) => {
    if (e.data.email) {
      emailError.value = 'Email already in use.'
    }
  })
  pending.value = false
}

</script>

<style scoped lang="sass">
:deep(.v-input:not(.v-input--error) #password-messages)
  color: var(--color1)!important
</style>

