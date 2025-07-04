<template>
  <div class="card card-hover">
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
            {{ portfolio.title }}
          </h3>
          <p class="text-primary-600 dark:text-primary-400 text-sm mb-4">
            {{ portfolio.description }}
          </p>
          <div class="flex items-center space-x-4 text-sm text-primary-500 dark:text-primary-500">
            <span>{{ (portfolio.projects && Array.isArray(portfolio.projects)) ? portfolio.projects.length : 0 }} projects</span>
            <span>{{ formatDate(portfolio.updatedAt) }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button
            @click="$emit('edit', portfolio)"
            class="p-2 text-primary-600 hover:text-accent-600 hover:bg-accent-50 dark:text-primary-400 dark:hover:text-accent-400 dark:hover:bg-accent-900/20 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="$emit('delete', portfolio)"
            class="p-2 text-primary-600 hover:text-error-600 hover:bg-error-50 dark:text-primary-400 dark:hover:text-error-400 dark:hover:bg-error-900/20 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="px-6 pb-6">
      <NuxtLink
        :to="`/portfolios/${portfolio.id}`"
        class="btn btn-primary w-full"
      >
        View Portfolio
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Portfolio {
  id: string
  title: string
  description: string
  projects: any[]
  updatedAt: string
}

defineProps<{
  portfolio: Portfolio
}>()

defineEmits<{
  edit: [portfolio: Portfolio]
  delete: [portfolio: Portfolio]
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>