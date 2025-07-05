<script setup>
// Redirect to dashboard if authenticated, otherwise to login
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'
import { watchEffect } from 'vue'

const auth = useAuthStore()

watchEffect(() => {
  if (auth.isAuthenticated) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-600"></div>
    </div>
  </div>
</template>