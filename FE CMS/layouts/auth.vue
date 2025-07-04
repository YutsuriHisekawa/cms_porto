<template>
  <div class="min-h-screen bg-primary-50 dark:bg-primary-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Redirect to dashboard if already authenticated
const { isAuthenticated } = useAuthStore()

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    navigateTo('/dashboard')
  }
}, { immediate: true })
</script>