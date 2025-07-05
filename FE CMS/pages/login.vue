<template>
  <div class="min-h-screen flex items-center justify-center ">
    <div v-if="!checkingAuth" class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative">
      <!-- Dark mode toggle -->
      <button
        class="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        @click="toggleDarkMode"
        aria-label="Toggle dark mode"
        type="button"
      >
        <svg v-if="isDark" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            name="username"
            class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
            :class="{ 'border-red-500': errors.username }"
            placeholder="Enter your username"
            autocomplete="username"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent pr-10"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95m3.25-2.568A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.422 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0" /></svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-accent-600 text-white hover:bg-accent-500 focus:ring-2 focus:ring-offset-2 focus:ring-accent-600 transition-colors"
        >
          <span v-if="loading" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-accent-600 hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300">
            Sign up
          </NuxtLink>
        </p>
      </div>
      <LoginErrorModal :show="showLoginError" @close="showLoginError = false" />
    </div>
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-600"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import Swal from 'sweetalert2'
import LoginErrorModal from '~/components/LoginErrorModal.vue'
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

definePageMeta({ layout: 'auth' })

const config = useRuntimeConfig()
const username = ref('')
const password = ref('')
const errors = ref({ username: '', password: '' })
const loading = ref(false)
const showLoginError = ref(false)
const isDark = ref(false)
const checkingAuth = ref(true)
const showPassword = ref(false)

const auth = useAuthStore()

onMounted(async () => {
  await auth.checkAuth()
  // Cek expired token
  if (auth.token) {
    try {
      const { exp } = auth.token
      if (Date.now() >= exp * 1000) {
        await auth.logout()
        return
      }
    } catch {
      await auth.logout()
      return
    }
  }
  if (auth.isAuthenticated) {
    await navigateTo('/dashboard')
  } else {
    checkingAuth.value = false
  }
})

const validateForm = () => {
  errors.value = { username: '', password: '' }
  let valid = true
  if (!username.value) {
    errors.value.username = 'Username is required'
    valid = false
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    valid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    valid = false
  }
  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    const response = await $fetch('/login', {
      baseURL: config.public.baseUrl,
      method: 'POST',
      body: { username: username.value, password: password.value },
      credentials: 'include'
    })
    
    if (response && response.token) {
      localStorage.setItem('auth', JSON.stringify(response))
      localStorage.setItem('auth-token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      await auth.checkAuth()
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Logged in successfully!',
        showConfirmButton: false,
        timer: 3000
      })
      await navigateTo('/dashboard')
    } else if (response && (response.error || response.message)) {
      const msg = response.error || response.message
      if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('username')) {
        errors.value.username = 'USERNAME atau PASSWORD salah'
        errors.value.password = 'USERNAME atau PASSWORD salah'
      } else {
        showLoginError.value = true
      }
      console.error('Login error:', msg)
    } else {
      showLoginError.value = true
      console.error('Unknown login error:', response)
    }
  } catch (err) {
    showLoginError.value = true
    console.error('Login exception:', err)
  } finally {
    loading.value = false
  }
}

const setDarkClass = (val) => {
  document.documentElement.classList.toggle('dark', val)
}
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  setDarkClass(isDark.value)
  localStorage.setItem('color-mode', isDark.value ? 'dark' : 'light')
}
onMounted(() => {
  const saved = localStorage.getItem('color-mode')
  if (saved) {
    isDark.value = saved === 'dark'
    setDarkClass(isDark.value)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkClass(isDark.value)
  }
})
</script>

<style scoped>
/* Add custom styles if needed */
</style>