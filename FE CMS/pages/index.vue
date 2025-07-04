<script setup>
// Redirect to dashboard if authenticated, otherwise to login
const { isAuthenticated } = useAuthStore()

if (isAuthenticated) {
  await navigateTo('/dashboard')
} else {
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-600"></div>
    </div>
  </div>
</template>