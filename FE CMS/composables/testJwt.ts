import Swal from 'sweetalert2'

export async function testInvalidJwt() {
  const token = 'invalid.jwt.token';
  try {
    const res: any = await $fetch('/login/validate-token', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.baseUrl,
      body: { token },
    })
    if (!res.valid) throw new Error('Token invalid')
    await Swal.fire({
      icon: 'success',
      title: 'Token valid',
      text: 'Token masih valid, sistem benar.'
    })
  } catch (err) {
    await Swal.fire({
      icon: 'warning',
      title: 'Sesi login telah habis',
      text: 'Silahkan login kembali (test JWT invalid)'
    })
  }
}
