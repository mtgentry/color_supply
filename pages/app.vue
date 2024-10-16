<template lang="pug">
  div Redirecting...
</template>

<script setup>
onMounted(async () => {
  await navigateTo({ path: 'https://old.colorsupplyyy.com/app/'}, {external: true })
})

</script>

<style scoped lang="sass">

</style>