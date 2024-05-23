import {defineStore} from 'pinia'

export const useDialogStore = defineStore('dialog', () =>{
  const signUpForm = ref(false)
  const changeSignUpForm = (value) => {
    signUpForm.value = value
  }
  return {
    signUpForm,
    changeSignUpForm
  }
})