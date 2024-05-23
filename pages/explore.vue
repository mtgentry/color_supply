<template lang="pug">
  v-row#explore
    v-col#filter(cols="2")
      ExploreFilter
    v-col#palettes(cols="10")
      ExplorePalettes
    ExplorePreviewBox
    v-dialog(max-width="510" v-model="signUpForm")
      v-card
        v-card-text
          AuthSignUp(source="explore")
            template(#header)
              div.text-center
                h1 Sign Up to Save Favorites
                h2 Sign up now to save and access your favorite color palettes anytime.
            template(#footer)
              div#signupFooter.text-center
                p Already have an account?  !{` `}
                  nuxt-link(to="/login") Log in
                p#terms By continuing you agree to our Terms of Service and Privacy Policy.

</template>

<script setup>
const dialogStore = useDialogStore()
const {signUpForm} = storeToRefs(dialogStore)
</script>

<style scoped lang="sass">
#filter
  padding: 0
  background-color: var(--color7)
  height: calc(100vh - 64px)
  overflow-y: auto
#palettes
  background-color: var(--color7)
</style>