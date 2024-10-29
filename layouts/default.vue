<template lang="pug">
  v-app(dark)
    NavBar
    v-main(v-auto-animate="{ duration: 200 }")
      v-container(fluid)
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
</script>

<style lang="sass">

.v-application
  background-color: var(--color6)
  overflow: hidden
  line-height: 1

.v-btn
  font-size: 14px
  font-style: normal
  font-weight: 500
  line-height: normal
  letter-spacing: 0.28px
  text-transform: none

.v-row
  margin: -16px

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
</style>