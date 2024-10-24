<template lang="pug">
.pricing-container.d-flex.flex-column(role="main")
  .nav-spacing
  .pricing-header
    h1.h2.pricing-title Pricing
    p.text_xl.sub_head Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  
  .pricing-plans
    // Basic Plan
    .pricing-card.d-flex.flex-column.pricing-divider
      h2#basic.plan-name.text_base Basic
      .price.d-flex
        span.currency $
        span.amount 0
        span.period /month
      .plan-features
        p.text_sm For designers, illustrators, developers & small teams.
        p.text_sm.bullet Save up to 500 favorites
    
    .divider-line
    
    // Hobbyist Plan
    .pricing-card.d-flex.flex-column.pricing-divider
      h2#hobbyist.plan-name.text_base Hobbyist
      .price.d-flex
        span.currency $
        span.amount 3
        span.period /month
      .plan-features
        p.text_sm For designers, illustrators, developers & small teams.
        p.text_sm.bullet Save up to 500 favorites
    
    .divider-line
    
    // Professional Plan  
    .pricing-card.d-flex.flex-column.pricing-divider
      h2#professional.plan-name.text_base Professional
      .price.d-flex
        span.currency $
        span.amount 9
        span.period /month
      .plan-features
        p.text_sm For designers, illustrators, developers & small teams.
        p.text_sm.bullet Save up to 500 favorites
    
    .divider-line
    
    // Business Plan
    .pricing-card.d-flex.flex-column
      h2#business.plan-name.text_base Business
      .price.d-flex
        span.currency $
        span.amount 19
        span.period /month
      .plan-features
        p.text_sm For designers, illustrators, developers & small teams.
        p.text_sm.bullet Save up to 500 favorites
  
  .signup-container
    v-btn#signup(color="primary" @click="handleSignUp") Sign Up Now
</template>

<script setup>
definePageMeta({
  auth: false,
  layout: 'default',
})
useHead({
  title: 'Pricing'
})

const { handleSignUp } = useSignUp()
</script>

<style lang="sass" scoped>
.pricing-container
  width: 100%
  max-width: 1088px
  margin: 0 auto
  background: var(--color7)
  display: flex
  flex-direction: column
  gap: 0px

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

.pricing-header
  text-align: center
  
.pricing-title
  margin-bottom: 1px


  @media (max-width: 599px)
    padding: 0 20px
    margin-top: 0px


.sub_head
  margin-top: 15px // Adjust the positioning as needed
  margin-bottom:20px



.pricing-plans
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

.pricing-card
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

.pricing-card:last-child
  @media (max-width: 599px)
    padding-bottom: 0

.pricing-plans > .divider-line:last-child
  @media (max-width: 599px)
    display: none
</style>