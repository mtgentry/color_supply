// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.IS_DEV },
  ssr: false,
  css: [
    '~/assets/css/custom.sass',
  ],
  vite: {
    server: {
      hmr: {
        clientPort: process.env.PORT,
      }
    }
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      baseURL: process.env.BASE_URL,
      IS_DEV: process.env.IS_DEV,
    },
  },
  nitro: {
    compressPublicAssets: !process.env.IS_DEV,
  },
  spaLoadingTemplate: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      script: process.env.IS_DEV ? [] : [
        { src: 'https://cdn.amplitude.com/libs/analytics-browser-2.7.4-min.js.gz' },
        { src: 'https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.4.1-min.js.gz' },
        { src: 'https://cdn.amplitude.com/libs/plugin-autocapture-browser-0.9.0-min.js.gz'},
        {
          hid: 'amplitude',
          innerHTML: `window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1})).promise.then(function() {window.amplitude.add(window.amplitudeAutocapturePlugin.plugin());window.amplitude.init('d5a19edbf9faf9ec5d29d4b3ec8c5441');});`,
          type: 'text/javascript',
          charset: 'utf-8'
        },
        {
          hid: 'heap',
          innerHTML: `
            window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
            heap.load("122057296");
          `,
          type: 'text/javascript',
          charset: 'utf-8'
        }
      ],
      __dangerouslyDisableSanitizersByTagID: process.env.IS_DEV ? {} : {
        amplitude: ['innerHTML']
      }
    },
    pageTransition: {
      name: 'fade',
      mode: 'out-in' // default
    },
    layoutTransition: {
      name: 'slide',
      mode: 'out-in' // default
    },
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
    moduleOptions: {
      styles: {
        configFile: 'assets/css/variables.scss',
      }
    },
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
      baseURL: process.env.BASE_URL,
      token:  {
        maxAgeInSeconds: 60 * 60,
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: 'refresh/', method: 'post' },
        token: {
          maxAgeInSeconds: 60 * 60 * 24 * 7,
        }
      },
      endpoints: {
        signIn: { path: 'login/', method: 'post' },
        signOut: false,
        signUp: { path: 'users/signup/', method: 'post' },
        getSession: { path: 'session/', method: 'get' },
      },
    },
  },
  snackbar: {
    top: true,
    right: true,
    duration: 2000,
  }
})
