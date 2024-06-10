<template lang="pug">
  v-container(v-if="palette")
    v-row
      v-col.pa-0.centered.clickable(cols="3" v-for="color in palette?.colors" @click="clipboard(color, snackbar)")
        svg(width="60" height="60" viewBox="0 0 60 60")
          circle(r="28" cx="30" cy="30" :fill="color" :stroke="title === 'white' ? 'var(--color3)' : ''" stroke-width="1")
        div.pt-1 {{ color.toUpperCase() }}
</template>

<script setup>
const snackbar = useSnackbar()
const colorStore = useColorStore()
const { palette, info } = storeToRefs(colorStore)
</script>

<style scoped lang="sass">
.v-row
  padding: 15px 10px 0 10px
</style>