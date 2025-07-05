import { useAuthStore } from '~/stores/auth'
import Swal from 'sweetalert2'

export default defineNuxtPlugin((nuxtApp) => {
  // Interval (per 1 menit) untuk cek token ke BE
  let intervalId: NodeJS.Timeout | null = null

  nuxtApp.hook('app:mounted', () => {
    const auth = useAuthStore()
    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(async () => {
      const token = localStorage.getItem('auth-token')
      if (!token) return
      try {
        const res: any = await $fetch('/login/validate-token', {
          method: 'POST',
          baseURL: useRuntimeConfig().public.baseUrl,
          body: { token },
        })
        if (!res.valid) throw new Error('Token invalid')
      } catch (err) {
        // Token tidak valid/expired
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        auth.logout()
        await Swal.fire({
          icon: 'warning',
          title: 'Sesi login telah habis',
          text: 'Silahkan login kembali',
        })
        window.location.href = '/login'
      }
    }, 60 * 1000) // cek tiap 1 menit
  })

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      if (intervalId) clearInterval(intervalId)
    })
  }
})
