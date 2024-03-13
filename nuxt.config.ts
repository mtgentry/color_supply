// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      baseURL: process.env.BASE_URL,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: [
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
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
  auth: {
    globalAppMiddleware: {
      isEnabled: false,
    },
    session: {
      enableRefreshOnWindowFocus: false,
    },
    baseURL: process.env.BASE_URL,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login/', method: 'post' },
        signOut: false,
        signUp: false,
        getSession: { path: '/session/', method: 'get' },
      },
      token: {
        maxAgeInSeconds: 60 * 60 * 24 * 7,
      }
    },
  }
})
