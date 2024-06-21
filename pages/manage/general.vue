<template lang="pug">
  ManageLayout
    #form
      v-form(@submit.prevent="saveChanges")
        v-text-field(v-model="state.name" label="Name" required placeholder="Sara" variant="outlined" name="name"
          :error-messages="v$.name.$errors.map(e => e.$message)" @blur="v$.name.$touch" @input="v$.name.$touch")
        v-text-field(v-model="state.email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined" name="email"
          :error-messages="v$.email.$errors.map(e => e.$message)"  @blur="v$.email.$touch")
        v-text-field#password(v-model="state.password" label="New Password" :type="showPassword ? 'text' : 'password'" required name="password"
        placeholder="Colorfan19#" :hint="!v$.password.$invalid ? '' : 'At least 8 characters, with a number or symbol'"
          :error-messages="v$.password.$errors.map(e => e.$message)"
          variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
          @blur="v$.password.$touch" auto)
        v-btn.mt-2(color="primary" type="submit") Save Changes
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import {email, required, helpers, minLength} from '@vuelidate/validators'
definePageMeta({
  middleware: ['auth'],
})
const snackbar = useSnackbar()
const showPassword = ref(false)
const symbol = helpers.regex(/[^a-zA-Z0-9\s]/)
const number = helpers.regex(/[0-9]/)

const { data } = await useAuth()
const initialState = {
  name: data.value.name,
  email: data.value.email,
  password: null,
}

const state = reactive({
  ...initialState,
})

const rules = {
  name: {
    required: helpers.withMessage('Name is required', required),
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Email must be valid', email),
  },
  password: {
    minLength: minLength(8),
    number: helpers.withMessage('Password must contain at least one number', number),
    symbol: helpers.withMessage('Password must contain at least one symbol', symbol),
  },
}

const v$ = useVuelidate(rules, state)

const saveChanges = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch()
    return
  }
  // Save changes
  await fetch('/users/update/', 'patch', state)
  state.password = null
  snackbar.add({
    type: 'info',
    text: 'Changes saved!'
  })
}
</script>

<style scoped lang="sass">
#form
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding-top: 170px
.v-form
  width: 500px

:deep(.v-input:not(.v-input--error) #password-messages)
  color: var(--color1)!important
</style>