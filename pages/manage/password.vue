<template lang="pug">
  ManageLayout(title="Password" description="To change your password, confirm your current one.")
    #form
      v-form(@submit.prevent="saveChanges")
        v-text-field(v-model="state.current_password" label="Current Password" :type="showCurrentPassword ? 'text' : 'password'" required name="current-password"
          placeholder="Colorfan19#" :hint="!v$.current_password.$invalid ? '' : 'At least 8 characters, with a number or symbol'"
          :error-messages="v$.current_password.$errors.map(e => e.$message)"
          variant="outlined" :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showCurrentPassword = !showCurrentPassword"
          @blur="v$.current_password.$touch" auto)
        v-text-field(v-model="state.password" label="New Password" :type="showPassword ? 'text' : 'password'" required name="password"
          placeholder="Colorfan19#" :hint="!v$.password.$invalid ? '' : 'At least 8 characters, with a number or symbol'" auto-complete="new-password"
          :error-messages="v$.password.$errors.map(e => e.$message)"
          variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
          @blur="v$.password.$touch" auto)
        v-text-field(v-model="state.password_confirm" label="Confirm New Password" :type="showNewPassword ? 'text' : 'password'" required name="confirm=password"
          placeholder="Colorfan19#" :hint="!v$.password_confirm.$invalid ? '' : 'At least 8 characters, with a number or symbol'"
          :error-messages="v$.password_confirm.$errors.map(e => e.$message)"
          variant="outlined" :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showNewPassword = !showNewPassword"
          @blur="v$.password_confirm.$touch" auto)
        .d-flex.justify-end
          v-btn(color="primary" type="submit" flat) Update Password
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import {required, helpers, minLength} from '@vuelidate/validators'
definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: false },
})
const snackbar = useSnackbar()
const showPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const symbol = helpers.regex(/[^a-zA-Z0-9\s]/)
const number = helpers.regex(/[0-9]/)

const { data } = await useAuth()
const initialState = {
  current_password: '',
  password: '',
  password_confirm: '',
}

const state = reactive({
  ...initialState,
})

const rules = {
  current_password: {
    required: helpers.withMessage('Current password is required', required),
  },
  password: {
    minLength: minLength(8),
    number: helpers.withMessage('Password must contain at least one number', number),
    symbol: helpers.withMessage('Password must contain at least one symbol', symbol),
    required: helpers.withMessage('Password is required', required),
  },
  password_confirm: {
    sameAs: helpers.withMessage('Passwords do not match', (value) => value === state.password),
    required: helpers.withMessage('Password confirmation is required', required),
  },
}

const v$ = useVuelidate(rules, state)

const saveChanges = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch()
    return
  }
  // Save changes
  await fetch('/users/update/', 'patch', state).then(() => {
    state.password = null
    snackbar.add({
      type: 'info',
      text: 'Changes saved!'
    })
    v$.value.$reset()
    state.current_password = null
    state.password_confirm = null
    state.password = null
  }).catch((error) => {
    if (error.data.current_password) {
      snackbar.add({
        type: 'error',
        text: 'Current password is incorrect'
      })
    }
  })

}
</script>

<style scoped lang="sass">
#form
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
.v-form
  width: 500px
  .v-input
    margin-bottom: 24px
    &:nth-child(3)
      margin-bottom: 40px

:deep(.v-input:not(.v-input--error) #password-messages)
  color: var(--color1)!important
</style>