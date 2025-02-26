<template lang="pug">
  v-app(dark)
    v-container.pa-0(fluid app)
      v-row(app)
        v-col(cols="12")
          v-alert(type='info' v-model="promo" @click:close="onClosePromo"  icon="close" closable)
            template(#text)
            .d-flex.flex-row.justify-space-between.align-items-center.w-100.px-4.pr-16
              .text-container.text-left.mr-4.mr-md-6.mr-lg-8
                | Thanks for trying Color Supply! 
                | Upgrade to VIP beta for 
                strong $28/yr 
                | (25% off)
              .button-container.d-flex.align-items-center
                v-btn.flex-shrink-0(@click="goToBilling" color="primary" flat variant="outlined" width="150" class="ml-auto ml-md-8") Upgrade Now
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
const onClosePromo = () => {
  localStorage.setItem('hidePromo', 'true')
  promo.value = false
}
const goToBilling = () => {
  window.location.href = '/promo'
}
const { data } = useAuth()
const showPromo = () => {
  if (data.value?.plan?.name === 'VIP Beta') return false
  return !localStorage.getItem('hidePromo');
}
const promo = ref(showPromo())
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
  min-height: 48px
  display: flex
  align-items: center
  justify-content: center
  padding: 8px 0 !important
  position: relative
.v-alert__content
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
.text-container
  flex: 1
  line-height: 1.4
  white-space: pre-wrap
.button-container
  display: flex
  align-items: center
  height: 100%
  margin-right: 40px
.v-btn
  font-weight: 100 
  background-color: var(--color1) !important
  color: var(--color7) !important
  padding: 0!important
  font-weight: 100
  position: relative !important
  z-index: 1 !important
strong
  font-weight: 700
</style>
<style>
/* Global styles (not scoped) to ensure we can target all alert components */
.v-alert .v-alert__close {
  position: absolute !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  height: auto !important;
  z-index: 5 !important;
}

.v-alert .v-btn--icon {
  position: absolute !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
}

.v-alert .mdi-close.mdi {
  position: absolute !important;
  right: 8px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  line-height: 48px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
}

/* Make sure the banner takes full width and handles responsive height */
.v-alert {
  width: 100% !important;
  max-width: 100% !important;
  line-height: 120%;
}

/* Responsive styles for very narrow screens */
@media (max-width: 600px) {
  .v-alert {
    min-height: 60px !important;
    padding: 8px 40px 8px 12px !important;
  }
  
  .v-alert .v-alert__content {
    align-items: center !important;
  }
  
  .v-alert .v-alert__content .text-container {
    font-size: 14px;
    max-width: 60%;
    flex: 1;
  }
  
  .v-alert .v-alert__content .button-container {
    display: flex;
    align-items: center;
  }
  
  .v-alert .v-alert__content .v-btn {
    font-size: 12px;
    padding: 0 12px !important;
    min-width: 100px !important;
    width: auto !important;
    margin-right: 90px !important;
  }
  
  .v-alert .v-alert__close,
  .v-alert .v-btn--icon,
  .v-alert .mdi-close.mdi {
    height: auto !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
}

/* Medium screens */
@media (min-width: 601px) and (max-width: 959px) {
  .v-alert {
    padding: 8px 40px 8px 16px !important;
  }
  
  .v-alert .v-alert__content .text-container {
    flex: 1;
    max-width: 70%;
  }

  .v-btn {
    margin-left: 20px !important;
    margin-top: 5px;
    align-items: center;
  }
    
  .v-alert .v-alert__content .v-btn {
    margin-right: 100px !important;
  }
}

/* Larger screens */
@media (min-width: 960px) {
  .v-alert .v-alert__content {
    flex-direction: row;
    align-items: center !important;
  }
  
  .v-alert .v-alert__content .text-container {
    margin-right: 24px;
    display: flex;
    align-items: center;
  }
  
  .v-alert .v-alert__content .v-btn {
    margin-right: 40px !important;
  }
}
</style>