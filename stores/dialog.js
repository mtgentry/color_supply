import {defineStore} from 'pinia'

export const useDialogStore = defineStore('dialog', () =>{
  const signUpForm = ref(false)
  const signUpFormPersistent = ref(false)
  const signUpInfluencer  = ref(false)
  const loginForm = ref(false)
  const source = ref('login')
  const loginFavorite = ref()
  const changeSignUpForm = (value, persistent=false, influencer) => {
    signUpForm.value = value
    signUpFormPersistent.value = persistent
    signUpInfluencer.value = influencer
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
    loginFavorite
  }
})