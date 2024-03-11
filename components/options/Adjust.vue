<template lang="pug">
  h2 Adjust
  div
    v-color-picker(v-model="color" mode="hsla" )



</template>

<script setup>
const color = ref('#000000')

</script>

<style scoped lang="sass">

</style>