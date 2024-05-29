import {defineStore} from 'pinia'

export const useDialogStore = defineStore('dialog', () =>{
  const signUpForm = ref(false)
  const signUpFormPersistent = ref(false)
  const loginForm = ref(false)
  const changeSignUpForm = (value, persistent=false) => {
    signUpForm.value = value
    signUpFormPersistent.value = persistent
  }
  const changeLoginForm = (value) => {
    loginForm.value = value
  }
  return {
    signUpForm,
    changeSignUpForm,
    signUpFormPersistent,
    loginForm,
    changeLoginForm
  }
})