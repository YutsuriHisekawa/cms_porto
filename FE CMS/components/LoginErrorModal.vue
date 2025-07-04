<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white dark:bg-primary-900 rounded-lg shadow-lg p-6 max-w-sm w-full text-center relative">
      <button @click="close" class="absolute top-2 right-2 text-primary-400 hover:text-primary-700 dark:hover:text-primary-200">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="mb-4">
        <svg class="w-12 h-12 mx-auto text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">Login Failed</h3>
      <p class="text-primary-600 dark:text-primary-300">USERNAME atau PASSWORD salah</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close'])
const close = () => emit('close')
</script>
