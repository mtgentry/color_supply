<template lang="pug">
  div#actions.centered
    v-btn(flat)
      IconsHeart
    v-btn(flat) Info
    v-btn(flat) Shuffle
    v-btn(flat) Adjust


</template>

<script setup>

</script>

<style scoped lang="sass">
#actions
  flex-direction: row
  justify-content: space-between
  padding: 26px 23px

.v-btn
  border: 1px solid var(--color4)
  color: var(--color4)
  font-size: 13px
  letter-spacing: 0.26px
</style>