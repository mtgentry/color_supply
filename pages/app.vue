<template lang="pug">
  div
</template>

<script setup>
// /app used to send visitors to the old Rails tool (old.colorsupplyyy.com/app).
// The color wheel now lives at /wheel, so old links and bookmarks go there.
definePageMeta({
  redirect: '/wheel',
})
</script>
