<template lang="pug">
  AuthSignUp
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/explore' },
  layout: 'auth',
})
useHead({
  title: 'Sign up',
})
</script>