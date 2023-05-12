// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@sidebase/nuxt-auth", "@nuxtjs/tailwindcss", "nuxt-icon", "@nuxtjs/supabase",  '@pinia/nuxt',  '@pinia-plugin-persistedstate/nuxt', '@vueuse/nuxt',],
  build: {
    transpile: ["trpc-nuxt"],
  },
  typescript: {
    shim: false,
  },
  css: ["@/assets/css/app.css"],
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    mailerEmail: process.env.MAILER_EMAIL,
    mailerPassword: process.env.MAILER_PASSWORD,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
  auth: { origin: process.env.AUTH_ORIGIN },
});