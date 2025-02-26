<template lang="pug">
  ManageLayout(title="General" description="Update your name and email details.")
    #form
      v-form(@submit.prevent="saveChanges")
        v-text-field(v-model="state.name" label="Name" required placeholder="Sara" variant="outlined" name="name"
          :error-messages="v$.name.$errors.map(e => e.$message)" @blur="v$.name.$touch" @input="v$.name.$touch")
        v-text-field(v-model="state.email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined" name="email"
          :error-messages="v$.email.$errors.map(e => e.$message)"  @blur="v$.email.$touch")
        .d-flex.justify-end
          v-btn(color="primary" type="submit" flat) Save Changes
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import {email, required, helpers, minLength} from '@vuelidate/validators'
definePageMeta({
  middleware: ['auth'],
})
const snackbar = useSnackbar()
const symbol = helpers.regex(/[^a-zA-Z0-9\s]/)
const number = helpers.regex(/[0-9]/)

const { data } = await useAuth()
const initialState = {
  name: data.value.name,
  email: data.value.email,
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
}

const v$ = useVuelidate(rules, state)

const saveChanges = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch()
    return
  }
  // Save changes
  await fetch('/users/update/', 'patch', state)
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
.v-form
  width: 500px

  .v-input
    margin-bottom: 24px
    &:nth-child(2)
      margin-bottom: 40px
</style>