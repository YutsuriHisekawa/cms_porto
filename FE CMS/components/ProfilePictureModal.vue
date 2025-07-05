<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
      <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Edit Profile Picture</h2>
      <div v-if="imageSrc" class="flex flex-col items-center">
        <img :src="imageSrc" alt="Preview" class="rounded-full w-40 h-40 object-cover border-4 border-accent-600 mb-6" />
        <div class="flex justify-between w-full gap-2">
          <button class="btn-secondary flex-1" @click="$emit('change-picture')">Change Photo</button>
          <button class="btn-primary flex-1" @click="saveImage">Save</button>
          <button class="btn-secondary flex-1" @click="$emit('close')">Cancel</button>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">No image selected</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ show: Boolean, imageFile: File })
const emits = defineEmits(['close', 'save', 'change-picture'])
const imageSrc = ref(null)

watch(() => props.imageFile, (newFile) => {
  if (newFile) {
    const reader = new FileReader()
    reader.onload = (e) => { imageSrc.value = e.target.result }
    reader.readAsDataURL(newFile)
  } else {
    imageSrc.value = null
  }
})

function saveImage() {
  if (!imageSrc.value) return
  fetch(imageSrc.value)
    .then(res => res.blob())
    .then(blob => emits('save', blob))
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 dark:focus:ring-offset-gray-800;
}
.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 dark:focus:ring-offset-gray-800;
}
</style>
