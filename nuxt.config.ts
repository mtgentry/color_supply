// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [
    '~/assets/css/custom.sass',
  ],
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
    '@formkit/auto-animate/nuxt',
    'nuxt-snackbar'
  ],
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          light: {
            colors: {
              info: '#4175DF',
            }
          },
        },
      },
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
        signUp: { path: '/users/signup/', method: 'post' },
        getSession: { path: '/session/', method: 'get' },
      },
      token: {
        maxAgeInSeconds: 60 * 60 * 24 * 7,
      }
    },
  },
  snackbar: {
    bottom: true,
    right: true,
    duration: 5000
  }
})
