<template lang="pug">
  div Redirecting...
</template>

<script setup>
onMounted(async () => {
  await navigateTo({ path: '/palettes' })
})

</script>

<style scoped lang="sass">

</style>