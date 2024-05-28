import {defineStore} from 'pinia'

export const useDialogStore = defineStore('dialog', () =>{
  const signUpForm = ref(false)
  const signUpFormPersistent = ref(false)
  const changeSignUpForm = (value, persistent=false) => {
    signUpForm.value = value
    signUpFormPersistent.value = persistent
  }
  return {
    signUpForm,
    changeSignUpForm,
    signUpFormPersistent
  }
})