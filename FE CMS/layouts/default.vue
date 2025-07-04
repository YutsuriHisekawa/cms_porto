<template>
  <div class="min-h-screen bg-primary-50 dark:bg-primary-950">
    <AppHeader />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 lg:ml-64">
        <div class="p-4 sm:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>
    <AppToast />
  </div>
</template>

<script setup>
const { checkAuth } = useAuthStore()

// Check authentication status on mount
onMounted(() => {
  checkAuth()
})
</script>