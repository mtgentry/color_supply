export const useSignUp = () => {
  const dialogStore = useDialogStore()
  const { changeSignUpForm } = dialogStore
  
  const handleSignUp = () => {
    changeSignUpForm(true)
  }
  
  return {
    handleSignUp
  }
}