<template lang="pug">
  ManageLayout
    #form
      v-form(@submit.prevent="saveChanges")
        v-text-field(v-model="state.name" label="Name" required placeholder="Sara" variant="outlined"
          :error-messages="v$.name.$errors.map(e => e.$message)" @blur="v$.name.$touch" @input="v$.name.$touch")
        v-text-field(v-model="state.email" label="Email" required placeholder="sara.smith@gmail.com"  variant="outlined"
          :error-messages="v$.email.$errors.map(e => e.$message)"  @blur="v$.email.$touch")
        v-btn(color="primary" type="submit") Save Changes
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { email, required, helpers } from '@vuelidate/validators'
const snackbar = useSnackbar();

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
  await fetch('/users/update/', 'patch', JSON.stringify(state))
  snackbar.add({
    type: 'success',
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
</style>