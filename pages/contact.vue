<template lang="pug">
  .contact-container.d-flex.flex-column(role="main")
    .nav-spacing
    .contact-header
      h1.h2.contact-title Contact
      p.text_xl.sub_head
        a(:href="mailtoEmail") {{ email }}
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  auth: false,
  layout: 'default',
})
useHead({
  title: 'contact'
})

// Define parts of the email address
const emailUser = 'hello'
const emailDomain = 'colorsupplyyy'
const emailTLD = 'com'

// Reactive reference for the email
const email = ref('')

// Computed property for the mailto link
const mailtoEmail = computed(() => `mailto:${email.value}`)

// Assemble the email address when the component mounts
onMounted(() => {
  email.value = `${emailUser}@${emailDomain}.${emailTLD}`
})

// Optional: If `handleSignUp` is no longer used, you can remove the following line
// const { handleSignUp } = useSignUp()
</script>


<style lang="sass" scoped>
.contact-container

  height: calc(100vh - 64px)
  margin: 0 auto
  background: var(--color7)
  display: flex
  flex-direction: column
  gap: 0px
  margin: -16px

  @media (max-width: 600px)
    padding: 0 20px 100px  

.nav-spacing
  height: 90px

.signup-container
  display: flex
  justify-content: center
  margin-top: 32px

  @media (max-width: 767px)
    display: none

#signup
  width: 226px
  height: 48px
  font-size: 16px
  letter-spacing: 0.32px
  text-transform: none

.contact-header
  text-align: center
  
.contact-title
  margin-bottom: 1px

  @media (max-width: 599px)
    padding: 0 20px
    margin-top: 0px

.sub_head
  margin-top: 15px // Adjust the positioning as needed
  margin-bottom:20px

.contact-plans
  display: flex
  justify-content: center
  align-items: flex-start
  gap: 0
  margin-top: 37px
  margin-bottom:30px

  @media (max-width: 767px)
    display: grid
    grid-template-columns: 1fr
    gap: 32px
    padding: 0 16px
    flex-wrap: wrap
    justify-content: center
    margin: 37px auto 0
    max-width: 767px

.contact-card
  width: 175px
  display: flex
  flex-direction: column
  gap: 10px

  @media (max-width: 599px)
    width: 100%
    max-width: 300px
    padding-bottom: 32px
  
  .plan-name
    color: var(--color2)
    font-weight: 700
    font-size: 16px
    line-height: 24px
    margin: 0
  
  .price
    margin: 0
    position: relative
    display: flex
    align-items: flex-end
    
    .currency
      position: absolute
      top: 8px
      left: 2px
      font-weight: 500
      font-size: 16px
      color: var(--color2)
    
    .amount
      margin-left: 16px
      font-weight: 500
      font-size: 48px
      line-height: 70%
      color: var(--color2)
    
    .period
      margin-left: 4px
      font-weight: 500
      font-size: 16px
      line-height: 1
      color: var(--color2)
      align-self: flex-end
    
    .free
      font-weight: 500
      font-size: 16px
      color: var(--color2)

  .plan-features
    margin: 0
    padding: 0

.period
  font-weight: 500
  font-size: 16px
  color: var(--color2)
  margin-left: 4px

.free
  font-weight: 500
  font-size: 16px
  color: var(--color2)

.plan-features
  color: var(--color2)
  font-size: 15px
  line-height: 1.5

.plan-name
  color: var(--color2)
  font-weight: bold
  font-size: 16px
  margin-bottom: 20px

.price
  height: 48px
  align-items: flex-start
  margin-bottom: 64px // Add space between price and features

.currency
  font-weight: 500
  font-size: 16px
  color: var(--color2)
  margin-right: 4px

.amount
  font-weight: 500
  font-size: 48px
  color: var(--color2)

.divider-line
  width: 1px
  height: 100px
  background-color: var(--color5) 
  margin: 0 32px
  align-self: center

  @media (max-width: 767px)
    display: block
    width: 100%
    height: 1px
    margin: 0
    background-color: var(--color5)

.contact-card:last-child
  @media (max-width: 599px)
    padding-bottom: 0

.contact-plans > .divider-line:last-child
  @media (max-width: 599px)
    display: none

.iconBtn
  padding: 0 10px
  cursor: pointer
  height: 34px
  min-width: unset
  background-color: transparent
  border-radius: 100%
  border: none

// TYPOGRAPHY
.h1, .h2, .h3, .h4, .h5, .h6
  text-transform: none

.h1
  font-size: 72px
  font-weight: 300
  line-height: 1
  letter-spacing: -0.015625rem

.h2
  font-size: 60px
  font-weight: 300
  line-height: 1
  letter-spacing: -0.008333rem

.h3
  font-size: 48px
  font-weight: 400
  line-height: 1.05

.h4
  font-size: 36px
  font-weight: 400
  line-height: 1.175

.h5
  font-size: 30px
  font-weight: 400
  line-height: 1.333

.h6
  font-size: 24px
  font-weight: 500
  line-height: 1.6

.text_xl
  font-size: 20px
  line-height: 30px

.text_lg
  font-size: 18px
  line-height: 28px

.p
  font-size: 16px
  line-height: 24px

.text_sm
  font-size: 14px
  line-height: 20px

.text_xs
  font-size: 12px
  line-height: 16px
</style>
