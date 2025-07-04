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
            <label for="name" class="label">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              name="name"
              required
              class="input"
              :class="{ 'input-error': errors.name }"
              placeholder="Enter your full name"
            />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
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
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              required
              class="input"
              :class="{ 'input-error': errors.password }"
              placeholder="Enter your password"
            />
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="label">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              class="input"
              :class="{ 'input-error': errors.confirmPassword }"
              placeholder="Confirm your password"
            />
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
import { useForm } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
  layout: 'auth'
})

const { register } = useAuthStore()
const { success, error } = useToast()

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required')
})

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema
})

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const onSubmit = handleSubmit(async (values) => {
  const result = await register(values)
  
  if (result.success) {
    success('Account created successfully!')
    await navigateTo('/dashboard')
  } else {
    error(result.error || 'Registration failed')
  }
})
</script>