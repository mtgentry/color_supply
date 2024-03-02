// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    'vuetify-nuxt-module',
    '@nuxtjs/google-fonts',
    '@formkit/auto-animate/nuxt'
  ],
  googleFonts: {
    families: {
      'IBM Plex Sans': true,
    }
  },
})
