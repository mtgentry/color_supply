<template lang="pug">
  div#signupForm(:class="source")
    slot(name="header")
      h1 Sign up to access more colors
    v-form
      v-text-field(v-model="state.name" label="Name" required placeholder="Sara" variant="outlined"
        :error-messages="v$.name.$errors.map(e => e.$message)" @blur="v$.name.$touch" @input="v$.name.$touch" autocomplete="name")
      v-text-field(v-model="state.email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined"
        :error-messages="emailError || v$.email.$errors.map(e => e.$message)"  @blur="v$.email.$touch" autocomplete="email")
      v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required
      placeholder="Colorfan19#" :hint="!v$.password.$invalid ? '' : 'At least 8 characters, with a number or symbol'"  :error-messages="v$.password.$errors.map(e => e.$message)"
        variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
        @blur="v$.password.$touch" autocomplete="new-password")
      v-checkbox(v-model="state.influencer" v-if="signUpInfluencer" v-show="false")
      v-btn#submit(color="primary" text @click="signup" :disabled="pending || v$.$invalid" flat) Create Free Account
      slot(name="footer")
        div.text-center
          p By continuing you agree to our Terms of Service and Privacy Policy.
          v-divider
          p Already have an account?  !{` `}
            nuxt-link(to="/login") Log in
</template>
<script setup>
import {useVuelidate} from '@vuelidate/core'
import {email, helpers, minLength, required} from '@vuelidate/validators'
const dialogStore = useDialogStore()
const {loginFavorite, signUpInfluencer, signUpPromo} = storeToRefs(dialogStore)
const snackbar = useSnackbar()
const router = useRouter()
const props = defineProps({
  source: {
    type: String,
    default: 'signup',
  }
})

const {data} = useAuth()
if (data.value) {
  navigateTo('/palettes')
}

const pending = ref(false)
const { signUp } = useAuth()
const initialState = {
  name: '',
  email: '',
  password: null,
  influencer: signUpInfluencer.value,
  promo: signUpPromo.value,
}

const state = reactive({
  ...initialState,
})
const emailError = ref(null)
const showPassword = ref(false)
const symbol = helpers.regex(/[^a-zA-Z0-9\s]/)
const number = helpers.regex(/[0-9]/)
const {changeSignUpForm} = dialogStore
const route = useRoute()

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
let signInOptions = {
  redirect: false,
}
if (['signup', 'private_invite'].includes(route.name)) {
  signInOptions = {
    callbackUrl: '/palettes'
  }
}

const signup = async () => {
  emailError.value = null
  pending.value = true
  await signUp(state, signInOptions).then(async () => {
    pending.value = false
    changeSignUpForm(false)
    if (loginFavorite.value) {
      await favorite(loginFavorite.value)
    }
    snackbar.add({
      type: 'info',
      text: 'Account created successfully!'
    })
    window.location.href = '/promo/billing/'
  }).catch((e) => {
    if (e.data.email) {
      emailError.value = 'Email already in use.'
    }
    pending.value = false
  })
}

onMounted(() => {
  const route = useRoute()
  if (route.query.delete) {
    snackbar.add({
      type: 'info',
      text: 'Account deleted successfully!'
    })
  }
})

</script>

<style scoped lang="sass">
#signupForm

  :deep(.v-input__details)
    padding-top: 6px
    padding-bottom: 6px

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
      line-height: 120%
      padding-top: 30px

    :deep(h2)
      font-size: 17px
      letter-spacing: 0.32px
      padding: 0 30px 40px 30px
      font-weight: 400

    :deep(#terms)
      padding-top: 24px
      margin: 0 -35px

    :deep(#signupFooter)
      font-size: 14px
      letter-spacing: 0.28px
</style>
