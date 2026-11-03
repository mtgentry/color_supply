<template lang="pug">
  v-row#manageLayout
    v-col#nav(cols="2")
      v-list.pa-0(density="compact" )
        v-list-item.pa-0
          nuxt-link(to="general") General
        v-list-item.pa-0
          nuxt-link(to="password") Password
        v-list-item.pa-0
          nuxt-link(to="plan") Plan
        v-list-item.pa-0
          nuxt-link(to="") Billing
      div.pa-0.centered
        v-btn#delete(color="red" variant="outlined" @click="deleteDialog = true") Delete Account
        //- same shell as the login / sign-up dialogs (components/dialogs/AuthShell.vue)
        DialogsAuthShell(v-model="deleteDialog")
          div.text-center
            h1 Delete Your Account?
            h2 Enter your password to confirm.
          v-text-field#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required autocomplete="false"
            variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
            hide-details="auto" :error="!!error" :error-messages="error ? [error] : []")
          v-btn#confirmDelete(flat @click='deleteAccount') Delete Account
          v-btn#cancelDelete(variant="text" @click='deleteDialog = false') Cancel
    v-col#content.pa-0(cols="10")
      v-container#title(v-if="title")
        v-row.ma-0
          v-col.pa-0(cols="12")
            .title {{ title }}
          v-col.pa-0(cols="12" v-if="description")
            .description {{ description }}
      slot
</template>


<script setup>
const {props} = defineProps({
  title: String,
  description: String,
})
const { signOut } = useAuth()
const initialState = {
  password: '',
}
const showPassword = ref(false)
const state = reactive({
  ...initialState,
})
const error = ref(null)
const deleteDialog = ref(false)
// clear the typed password and any error when the dialog closes
watch(deleteDialog, (open) => {
  if (!open) {
    state.password = ''
    error.value = null
    showPassword.value = false
  }
})
const deleteAccount = async () => {
  try {
    await fetch('users/delete/', 'delete', {password: state.password});
    await signOut({redirect: false});
    await navigateTo('/signup?delete=true');
  } catch (e) {
    if (e.data?.password) {
      error.value = e.data.password;
    }
  }
}
</script>


<style scoped lang="sass">
#nav
  background-color: var(--color6)

  display: flex
  flex-direction: column
  justify-content: space-between
  font-size: 18px
  padding: 16px 24px 24px 24px

.v-list
  background-color: var(--color6)
  padding: 20px

:deep(.v-list-item)
  padding-inline: 0

#content
  background-color: var(--color7)
#delete
  background-color: var(--color7)

a
  text-decoration: none!important
  color: var(--color2)
.router-link-active
  text-decoration: underline

a:hover
  color: var(--color1)

#delete
  width: 100%

// delete-account dialog buttons (frame + heading + field styles come from AuthShell)
// height !important: assets/css/custom.sass forces .v-btn--size-default to 32px!important
#confirmDelete
  width: 100%
  height: 48px!important
  margin-top: 10px
  border-radius: 8px
  background-color: var(--color9)!important
  color: var(--color7)!important
  font-size: 16px
  font-weight: 500
  letter-spacing: 0
  text-transform: none

#cancelDelete
  width: 100%
  height: 44px!important
  margin-top: 8px
  border-radius: 8px
  color: var(--color3)!important
  font-size: 15px
  font-weight: 500
  letter-spacing: 0
  text-transform: none

#title
  display: flex
  flex-direction: column
  padding: 120px 0 0 0
  width: 500px
  .title
    font-size: 24px
    font-style: normal
    font-weight: 500
    padding-bottom: 16px
  .description
    font-size: 18px
    font-style: normal
    font-weight: 500
    color: var(--color3)
    padding-bottom: 64px

#manageLayout
  height: calc(100vh - 64px)
</style>