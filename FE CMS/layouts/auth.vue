<template>
  <div class="min-h-screen bg-primary-50 dark:bg-primary-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'
import { watchEffect } from 'vue'

const auth = useAuthStore()

watchEffect(() => {
  if (auth.isAuthenticated) {
    navigateTo('/dashboard')
  }
})
</script>