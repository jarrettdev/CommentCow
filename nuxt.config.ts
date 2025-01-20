// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  mongoUri: process.env.MONGO_URI,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: ''
  },
  plugins: [
    '~/plugins/vue-toastification.ts'
  ],
  build: {
    transpile: ['vue-toastification'],
  },
})
