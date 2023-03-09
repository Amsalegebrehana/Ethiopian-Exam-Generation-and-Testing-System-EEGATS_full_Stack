// file: ~/middleware/authentication.global.ts
import { callWithNuxt, useNuxtApp } from "#app";

export default defineNuxtRouteMiddleware(async (to) => {
  // It's important to do this as early as possible
  const nuxtApp = useNuxtApp();

  const { status, signIn, getSession } = useSession();
    const res= await getSession();
  // Return immeadiatly if user is already authenticated
  if (status.value === "authenticated" && res?.role === "contributor") {
    return;
  }

  /**
   * We cannot directly call and/or return `signIn` here as `signIn` uses async composables under the hood, leading to "nuxt instance undefined errors", see https://github.com/nuxt/framework/issues/5740#issuecomment-1229197529
   *
   * So to avoid calling it, we call it via `callWithNuxt`.
   */
  await callWithNuxt(nuxtApp, signIn, [undefined, { callbackUrl: to.path }]);
});
