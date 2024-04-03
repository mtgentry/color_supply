<template lang="pug">
  v-expansion-panel(elevation="0")
    v-expansion-panel-title
      template(v-slot:default="{ expanded }")
        div {{ title }}
      template(v-slot:actions="{ expanded }")
        img(:src="expanded ? '/img/icons/carat_open.svg' : '/img/icons/carat_closed.svg'")
    v-expansion-panel-text
      slot
</template>

<script setup>
const props = defineProps({
  title: String
})
</script>