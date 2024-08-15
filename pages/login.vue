<template lang="pug">
  AuthLogin.form
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/palettes' },
  layout: 'auth',
})

useHead({
  title: 'Sign in',
})
</script>
