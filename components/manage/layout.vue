<template lang="pug">
  v-row
    v-col#nav.pa-0(cols="1")
      v-list(density="compact" )
        v-list-item
          nuxt-link(to="general") General
        v-list-item
          nuxt-link(to="plan") Plan
      div.pa-5.centered
        v-dialog(max-width='500')
          template(v-slot:activator='{ props: activatorProps }')
            v-btn#delete(color="red" variant="outlined" v-bind='activatorProps') Delete Account
          template(v-slot:default='{ isActive }')
            v-card
              v-card-text
                div Are you sure you want to delete your account?
                v-text-field.pt-3#password(v-model="state.password" label="Password" :type="showPassword ? 'text' : 'password'" required autocomplete="false"
                  variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"  @click:append-inner="showPassword = !showPassword"
                  :error="error" :error-messages="error ? [error] : []")
              v-card-actions
                v-btn(color='red' text @click='deleteAccount') Delete Account
                v-spacer
                v-btn(text='No' @click='isActive.value = false')
    v-col#content.pa-0(cols="11")
      slot
</template>


<script setup>
const { signOut } = useAuth()
const initialState = {
  password: '',
}
const showPassword = ref(false)
const state = reactive({
  ...initialState,
})
const error = ref(null)
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
  height: calc(100vh - 64px)
  display: flex
  flex-direction: column
  justify-content: space-between
  font-size: 18px

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
  text-decoration: none
  color: var(--color2)
.router-link-active
  text-decoration: underline

a:hover
  color: var(--color1)


</style>