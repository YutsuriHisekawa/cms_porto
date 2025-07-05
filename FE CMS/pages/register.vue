<template>
  <div>
    <div class="card">
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Create Account</h2>
          <p class="text-primary-600 dark:text-primary-400 mt-2">Get started with your portfolio</p>
        </div>

        <form @submit="onSubmit" class="space-y-6">
          <div>
            <label for="nama_lengkap" class="label">Full Name</label>
            <input
              id="nama_lengkap"
              v-model="nama_lengkap"
              type="text"
              name="nama_lengkap"
              required
              class="input"
              :class="{ 'input-error': errors.nama_lengkap }"
              placeholder="Enter your full name"
            />
            <p v-if="errors.nama_lengkap" class="error-text">{{ errors.nama_lengkap }}</p>
          </div>

          <div>
            <label for="username" class="label">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              name="username"
              required
              class="input"
              :class="{ 'input-error': errors.username }"
              placeholder="Enter your username"
            />
            <p v-if="errors.username" class="error-text">{{ errors.username }}</p>
          </div>

          <div>
            <label for="email" class="label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              required
              class="input"
              :class="{ 'input-error': errors.email }"
              placeholder="Enter your email"
            />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="label">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                class="input pr-10"
                :class="{ 'input-error': errors.password }"
                placeholder="Enter your password"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95m3.25-2.568A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.422 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0" /></svg>
              </button>
            </div>
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>
          <div>
            <label for="confirmPassword" class="label">Confirm Password</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirmPassword"
                required
                class="input pr-10"
                :class="{ 'input-error': errors.confirmPassword }"
                placeholder="Confirm your password"
              />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95m3.25-2.568A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.422 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0" /></svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary w-full"
          >
            <span v-if="isSubmitting" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-primary-600 dark:text-primary-400">
            Already have an account?
            <NuxtLink to="/login" class="font-medium text-accent-600 hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Hapus vee-validate, gunakan ref dan validasi manual
import { ref } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'auth'
})

const { register } = useAuthStore()
const { success, error } = useToast()

const nama_lengkap = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({})
const isSubmitting = ref(false)

function validate() {
  const err = {}
  if (!nama_lengkap.value || nama_lengkap.value.length < 2) err.nama_lengkap = 'Full name must be at least 2 characters'
  if (!username.value || username.value.length < 3) err.username = 'Username must be at least 3 characters'
  if (!email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) err.email = 'Invalid email'
  if (!password.value || password.value.length < 6) err.password = 'Password must be at least 6 characters'
  if (confirmPassword.value !== password.value) err.confirmPassword = 'Passwords must match'
  if (!confirmPassword.value) err.confirmPassword = 'Confirm password is required'
  errors.value = err
  return Object.keys(err).length === 0
}

async function onSubmit(e) {
  e.preventDefault()
  if (!validate()) return
  isSubmitting.value = true
  try {
    const config = useRuntimeConfig()
    const result = await $fetch('/users', {
      baseURL: config.public.baseUrl,
      method: 'POST',
      body: {
        nama_lengkap: nama_lengkap.value,
        username: username.value,
        email: email.value,
        password: password.value,
        repassword: confirmPassword.value
      }
    })
    success('Account created successfully!')
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Register Berhasil',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
    await navigateTo('/login')
  } catch (err) {
    const msg = err?.data?.error || err?.message || 'Registration failed'
    error(msg)
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: msg,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>