import { defineStore } from 'pinia'
export const useColorStore = defineStore('plan', () =>{
  const selectedColor = ref(null)
  const colors = ref([
    {
      h: 40,
      s: 1,
      l: 0.5,
      a: 1
    },
    {
      h: 80,
      s: 1,
      l: 0.5,
      a: 1
    },
    {
      h: 120,
      s: 1,
      l: 0.5,
      a: 1
    },
    {
      h: 160,
      s: 1,
      l: 0.5,
      a: 1
    },
    {
      h: 240,
      s: 1,
      l: 0.5,
      a: 1
    },
    {
      h: 320,
      s: 1,
      l: 0.5,
      a: 1
    },
    ]
  )
  const selectColor = (color) => {
    selectedColor.value = color
  }
  const updateSelectedColor = (color) => {
    colors.value[selectedColor.value] = color
  }

  return {
    selectedColor,
    selectColor,
    colors,
    updateSelectedColor
  }
})