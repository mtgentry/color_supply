<template lang="pug">
  div#loginForm(:class="source")
    slot(name="header")
      h1 Log in
    v-form(@submit.prevent="login")
      v-text-field(v-model="state.email" label="Email" required email="sara.smith@gmail.com"  variant="outlined"
        :error-messages="v$.email.$errors.map(e => e.$message)" @blur="v$.email.$touch" autocomplete="email")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required placeholder="Colorfan19#"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        :error-messages="v$.password.$errors.map(e => e.$message)" @blur="v$.password.$touch" autocomplete="current-password")
      v-btn#submit(color="primary" type="submit" :disabled="pending || v$.$invalid") Continue
      slot(name="footer")
        div#description
          p Forgot password? !{` `}
            nuxt-link(to="/reset") Reset
          p Don’t have an account? !{` `}
            nuxt-link(to="/signup") Sign up
</template>
<script setup>
import {email, helpers, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
const pending = ref(false)
const props = defineProps({
  source: {
    type: String,
    default: 'login',
  }
})

const dialogStore = useDialogStore()
const { signIn } = useAuth()

const error_message = ref('')
const initialState = {
  email: '',
  password: '',
}
const snackbar = useSnackbar()
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
    pending.value = true
    await signIn({ email: state.email, password: state.password }, {callbackUrl: '/explore'})
    const was_logged = useCookie('was_logged')
    was_logged.value = true
    dialogStore.changeLoginForm(false)
    dialogStore.changeSignUpForm(false)
    snackbar.add({
      type: 'info',
      text: 'Logged in successfully',
    })
  } catch (error) {
    error_message.value = error.data.detail
    // console.error(error)
  }
  pending.value = false
}
</script>

<style scoped lang="sass">
#loginForm
  :deep(.v-input:not(.v-input--error) #password-messages)
    color: var(--color1)!important

  #submit
    background-color: var(--color1)!important
    font-size: 16px
    font-style: normal
    font-weight: 300
    line-height: normal
    letter-spacing: 0.32px
    width: 100%
    margin: 14px 0

  &.explore
    padding: 0 40px

    :deep(h1)
      font-size: 30px
      letter-spacing: 0.6px
      font-weight: 500
      padding-top: 30px

    :deep(h2)
      font-size: 16px
      letter-spacing: 0.32px
      padding: 0 30px 40px 30px

    :deep(#terms)
      padding-top: 24px
      margin: 0 -35px

    :deep(#signupFooter)
      font-size: 14px
      letter-spacing: 0.28px
</style>