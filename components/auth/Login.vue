<template lang="pug">
  div#loginForm(:class="source")
    slot(name="header")
      h1 Log in
    v-form(@submit.prevent="login")
      v-text-field(v-model="state.email" label="Email" required email="sara.smith@gmail.com"  variant="outlined"
        :hide-details="source === 'explore' ? 'auto' : false"
        :error-messages="v$.email.$errors.map(e => e.$message)" @blur="v$.email.$touch" autocomplete="email")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required placeholder="Colorfan19#"
        :hide-details="source === 'explore' ? 'auto' : false"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        :error-messages="v$.password.$errors.map(e => e.$message)" @blur="v$.password.$touch" autocomplete="current-password")
      v-alert.pa-1(v-if="error_message" type="error") {{ error_message }}
        template(v-slot:prepend)
      v-btn#submit(color="primary" type="submit" :disabled="pending || v$.$invalid") Continue
      slot(name="footer")
        div#description
          p Forgot password? !{` `}
            nuxt-link(to="/reset") Reset
          p Don’t have an account? !{` `}
            nuxt-link(to="/signup") Sign up
</template>
<script setup>
import {email, helpers, required} from "@vuelidate/validators"
import {useVuelidate} from "@vuelidate/core"
const route = useRoute()
const pending = ref(false)
const props = defineProps({
  source: {
    type: String,
    default: 'login',
  }
})

const dialogStore = useDialogStore()
const { loginFavorite } = storeToRefs(dialogStore)
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
  },
}
const v$ = useVuelidate(rules, state)
let signInOptions = {
  redirect: false,
}
if (route.name === 'login') {
  signInOptions = {
    callbackUrl: '/palettes'
  }
}

const login = async () => {
  try {
    pending.value = true
    await signIn({ email: state.email, password: state.password }, signInOptions)
    trackEvent('Logged In')
    const was_logged = useCookie('was_logged')
    was_logged.value = true
    dialogStore.changeLoginForm(false)
    dialogStore.changeSignUpForm(false)
    if (loginFavorite.value) {
      favorite(loginFavorite.value)
    }
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

  // standalone /login page only — the dialog version (source="explore") is styled by components/dialogs/AuthShell.vue
  &:not(.explore) #submit
    background-color: var(--color1)!important
    font-size: 16px
    font-style: normal
    font-weight: 300
    line-height: normal
    letter-spacing: 0.32px
    width: 100%
    margin: 14px 0
</style>
