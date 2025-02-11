import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog', () => {
  const signUpForm = ref(false)
  const signUpFormPersistent = ref(false)
  const signUpInfluencer = ref(false)
  const signUpPromo = ref(false)
  const loginForm = ref(false)
  const source = ref('login')
  const loginFavorite = ref()
  
  const changeSignUpForm = (value, persistent=false, influencer=false, promo=false) => {
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