// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@sidebase/nuxt-auth", "@nuxtjs/tailwindcss", "nuxt-icon"],
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
  },
  auth: { origin: process.env.AUTH_ORIGIN },
});
