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
                v-btn#delete(color='red' text @click='deleteAccount') Delete Account
                v-spacer
                v-btn(text='No' @click='isActive.value = false')
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