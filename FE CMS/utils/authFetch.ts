import { useAuthStore } from '~/stores/auth'

export async function authFetch(url: string, options: any = {}) {
  const auth = useAuthStore()
  const token = auth.token || localStorage.getItem('auth-token')
  if (token) {
    try {
      options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
      }
    } catch {
      await auth.logout()
      throw new Error('Token invalid')
    }
  }
  return $fetch(url, options)
}
