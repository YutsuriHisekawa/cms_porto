import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  await auth.checkAuth()
  if (auth.token) {
    try {
      // JWT decode dihapus
      // Tidak ada pengecekan exp di sini
    } catch (e) {
      await auth.logout()
      return navigateTo('/login')
    }
  }
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})