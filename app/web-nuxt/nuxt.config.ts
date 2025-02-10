// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/tailwind.css'],
  vite: {
    server: {
      watch: {
        usePolling: true, // necessary for use with podman container
        interval: 300, // ms
      },
    },
  },
});
