<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Portfolio Header -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div class="p-8">
          <div class="flex flex-col md:flex-row gap-6 items-center">
            <div class="relative w-full md:w-48 h-48 flex-shrink-0">
              <img 
                v-if="portfolio.upload_header" 
                :src="config.public.baseUrl + portfolio.upload_header" 
                class="w-full h-full object-cover rounded-lg shadow-md"
                :alt="portfolio.title"
              >
              <div 
                v-else
                class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center"
              >
                <span class="text-4xl text-white font-bold">{{ portfolio.title?.charAt(0) || 'P' }}</span>
              </div>
            </div>
            
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ portfolio.title }}</h1>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">{{ portfolio.description }}</p>
              
              <div class="flex flex-wrap gap-2 mt-4">
                <span 
                  v-if="portfolio.category"
                  class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
                >
                  {{ portfolio.category }}
                </span>
                <span 
                  v-if="portfolio.created_at"
                  class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                >
                  {{ new Date(portfolio.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery Section -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Project Gallery
        </h2>
        
        <div v-if="portfolio.project_d && portfolio.project_d.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(detail, index) in portfolio.project_d" 
            :key="detail.uuid"
            class="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-800">
              <img 
                v-if="detail.picture_url" 
                :src="config.public.baseUrl + detail.picture_url" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                :alt="`Project image ${index + 1}`"
                loading="lazy"
              >
              <div v-else class="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div v-if="detail.description" class="p-4 bg-white dark:bg-gray-900">
              <p class="text-gray-600 dark:text-gray-300">{{ detail.description }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No images yet</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">This project doesn't have any gallery images.</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-end space-x-4">
        <NuxtLink 
          to="/portfolios" 
          class="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Portfolios
        </NuxtLink>
        <NuxtLink 
          :to="`/portfolios/${portfolio.slug}/edit`" 
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Portfolio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import Swal from 'sweetalert2'

const route = useRoute()
const config = useRuntimeConfig()
const portfolio = ref({
  title: '',
  description: '',
  upload_header: null,
  project_d: [],
  category: '',
  created_at: ''
})
const isLoading = ref(true)

const fetchPortfolio = async () => {
  const slug = route.params.slug
  if (!slug) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Invalid URL', 
      text: 'Portfolio slug is missing.'
    })
    return
  }
  try {
    isLoading.value = true
    const data = await $fetch(`/project/${slug}`, {
      baseURL: config.public.baseUrl,
      method: 'GET',
      credentials: 'include'
    })
    portfolio.value = data
  } catch (err) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Failed to fetch project', 
      text: err?.message || 'Unknown error'
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPortfolio()
})
</script>

<style scoped>
/* ...existing style... */
</style>
