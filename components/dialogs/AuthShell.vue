<template lang="pug">
  //- Shared shell for the login + sign-up dialogs, so both use one set of styles.
  //- Put the form (AuthLogin / AuthSignUp with source="explore") in the default slot.
  v-dialog(max-width="448" :model-value="modelValue" @update:model-value="v => emit('update:modelValue', v)" :persistent="persistent")
    v-card.auth-card
      v-btn.close-btn(v-if="!persistent" icon="mdi-close" variant="text" size="small" aria-label="Close" @click="emit('update:modelValue', false)")
      v-card-text
        slot
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // persistent dialogs can't be dismissed, so they get no close button
  persistent: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="sass" scoped>
.auth-card
  border-radius: 16px!important
  position: relative

  // !important: Vuetify's `.v-dialog > .v-overlay__content > .v-card > .v-card-text` padding is more specific
  .v-card-text
    padding: 44px 40px 28px!important

  // header (passed in through the form's #header slot)
  :deep(h1)
    font-size: 26px
    font-weight: 600
    line-height: 1.2
    letter-spacing: -0.4px
    color: var(--color2)
    margin-bottom: 8px
    text-wrap: balance

  :deep(h2)
    font-size: 15px
    font-weight: 400
    line-height: 1.5
    letter-spacing: 0
    color: var(--color3)
    max-width: 300px
    margin: 0 auto 28px
    text-wrap: balance

  // fields (error messages and hints still appear under a field when needed)
  :deep(.v-text-field)
    margin-bottom: 14px

  :deep(.v-field)
    border-radius: 8px

  :deep(#submit)
    width: 100%
    // !important: assets/css/custom.sass forces .v-btn--size-default to 32px!important
    height: 48px!important
    margin: 10px 0 20px
    border-radius: 8px
    background-color: var(--color1)!important
    color: var(--color7)!important
    font-size: 16px
    font-weight: 500
    letter-spacing: 0
    text-transform: none

  // footer (passed in through the form's #footer slot)
  :deep(#signupFooter)
    font-size: 14px
    letter-spacing: 0
    color: var(--color3)
    p
      margin: 0
    p + p
      margin-top: 6px
    a
      color: var(--color1)
      font-weight: 500
      cursor: pointer
      text-decoration: none
      &:hover
        text-decoration: underline

  // nested under #signupFooter so it outranks the `p` margins above
  :deep(#signupFooter #terms)
    margin-top: 24px
    padding-top: 16px
    border-top: 1px solid var(--color5)
    font-size: 12px
    line-height: 1.5
    color: var(--color4)
    text-wrap: balance

// square 36px button with a 15px icon centered in it, so top: 9.5px / right: 9.5px
// puts the icon itself 20px from both the top and right edges of the card
.close-btn
  position: absolute
  top: 9.5px
  right: 9.5px
  width: 36px!important
  height: 36px!important
  z-index: 1
  color: var(--color3)
</style>
