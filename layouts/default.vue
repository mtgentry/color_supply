<template lang="pug">
  v-app(dark)
    v-container.pa-0(fluid app)
      v-row(v-if="status" app)
        v-col(cols="12")
          v-alert(type='info' v-if="status === 'success'" v-model="isAlertVisible" @click:close="onClose" icon="")
            template(#text)
            .d-flex.centered.flex-row
              span.pr-5 {{alertMessage}}
              v-btn(@click="closeAlert" color="primary" flat  variant="outlined" min-width="45" ) OK
    v-main(v-auto-animate="{ duration: 200 }" app)
      NavBar
      v-container#content(fluid)
        slot
      DialogsSignUp
      DialogsLogin
    NuxtSnackbar
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Color Supply` : 'Color Supply';
  }
})
onBeforeMount(async () => {
  // TODO: Remove this when the issue is fixed
  const { refresh: refreshToken } = useAuth()
  const refreshCookie = useCookie('auth.refresh-token')
  const tokenCookie = useCookie('auth.token')
  if (refreshCookie.value && !tokenCookie.value) {
    await refreshToken()
  }
})
const isAlertVisible = ref(true)
const closeAlert = () =>  {
  isAlertVisible.value = false
}
const { data } = useAuth()
const route = useRoute()
const status = computed(() => route.query.status)
const alertMessage = computed(() => {
  if (status.value === 'success') {
    return `Success! Your subscription plan has been changed to ${data.value.plan.name}`
  }
})
</script>

<style lang="sass" scoped>

.v-application
  background-color: var(--color6)
  overflow: hidden
  line-height: 1

#content
  display: flex
  flex-direction: column

  .v-row
    flex-grow: 1


h2
  font-size: 22px
  font-weight: 400
  letter-spacing: 0.44px

.fade-enter-active, .fade-leave-active
  transition: all 0.13s

.fade-enter-from, .fade-leave-to
  opacity: 0


#preview-drawer
  .v-navigation-drawer__content
    overflow: hidden

.v-application
  height: 100vh

.v-alert
  text-align: center

.v-btn
  background-color: var(--color1) !important
  color: var(--color7) !important
  padding: 0!important
  font-weight: 100
</style>