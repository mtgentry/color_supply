import {defineStore} from 'pinia'

export const useDialogStore = defineStore('dialog', () =>{
  const signUpForm = ref(false)
  const signUpFormPersistent = ref(false)
  const signUpInfluencer  = ref(false)
  const signUpPromo = ref(false)
  const loginForm = ref(false)
  const source = ref('login')
  const loginFavorite = ref()
  const changeSignUpForm = (value, persistent=false, influencer, promo) => {
    if (value && !signUpForm.value) {
      // source: what prompted it ('favorite', 'promo', or 'login' for the nav and pricing buttons);
      // forced: the dialog can't be dismissed (shown after hitting a limit)
      trackEvent('Sign Up Opened', { source: source.value, forced: persistent, promo: !!promo })
    }
    signUpForm.value = value
    signUpFormPersistent.value = persistent
    signUpInfluencer.value = influencer
    signUpPromo.value = promo
  }
  const changeLoginForm = (value) => {
    loginForm.value = value
  }
  const changeSource = (value) => {
    source.value = value
  }
  return {
    signUpForm,
    changeSignUpForm,
    signUpFormPersistent,
    loginForm,
    changeLoginForm,
    source,
    changeSource,
    signUpInfluencer,
    signUpPromo,
    loginFavorite
  }
})