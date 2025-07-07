<template>
  <div class="w-full">
    <!-- Hero Header -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-8 md:p-12 mb-12 text-white">
      <div class="max-w-4xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome back, {{ user?.nama }}!</h1>
        <p class="text-lg md:text-xl opacity-90 mb-6">Here's what's happening with your portfolios today</p>
        <NuxtLink to="/portfolios/create"
          class="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Portfolio
        </NuxtLink>
      </div>
      <div class="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10"></div>
      <div class="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/5"></div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Portfolios Section -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Your Portfolios</h2>
          <div class="flex items-center gap-2">
            <NuxtLink to="/portfolios"
              class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-accent-400 dark:hover:text-accent-300 flex items-center">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <button @click="viewMode = 'grid'" :class="['ml-2 p-2 rounded', viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700']" title="Grid View">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="4" width="7" height="7" rx="2"/>
                <rect x="13" y="4" width="7" height="7" rx="2"/>
                <rect x="4" y="13" width="7" height="7" rx="2"/>
                <rect x="13" y="13" width="7" height="7" rx="2"/>
              </svg>
            </button>
            <button @click="viewMode = 'list'" :class="['p-2 rounded', viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700']" title="List View">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="6" width="16" height="4" rx="2"/>
                <rect x="4" y="14" width="16" height="4" rx="2"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
            <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <div v-else-if="(filteredPortfolios?.length || 0) === 0"
          class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No portfolios yet</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first portfolio</p>
          <NuxtLink to="/portfolios/create" class="btn btn-primary">
            Create Portfolio
          </NuxtLink>
        </div>

        <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ' : 'flex flex-col space-y-6'">
          <PortfolioCard
            v-for="portfolio in filteredPortfolios"
            :key="portfolio.id"
            :portfolio="portfolio"
            @edit="handleEditPortfolio"
            @delete="handleDeletePortfolio"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <NuxtLink to="/portfolios/create"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div
                class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-600 dark:text-accent-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">New Portfolio</span>
            </NuxtLink>
            <NuxtLink to="/settings"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Settings</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <template v-if="isLoading">
              <div v-for="i in 3" :key="i" class="flex items-start animate-pulse">
                <div
                  class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-1">
                </div>
                <div class="flex-1">
                  <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div class="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </template>
            <template v-else-if="(filteredPortfolios?.length || 0) === 0">
              <div class="p-0 text-center">
                <div class="max-w-xs mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 class="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">No recent activity</h4>
                  <p class="text-gray-500 dark:text-gray-400 mb-4 text-sm">Your activity will appear here</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-for="portfolio in filteredPortfolios.slice(0, 3)" :key="portfolio.uuid" class="flex items-start">
                <div
                  class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Updated portfolio "{{ portfolio.title }}"
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(portfolio.updated_at) }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const user = ref({})
const portfolios = ref([])
const filteredPortfolios = computed(() => {
  const userId = user.value?.id
  if (!userId) return []
  return portfolios.value.filter(p => p.user_id === userId)
})
const isLoading = ref(false) // Paksa loading true untuk cek shimmer
const viewMode = ref('grid') // 'grid' atau 'list'

// Get user data from localStorage
const getUserFromLocalStorage = () => {
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (e) {
        console.error('Error parsing user data:', e)
        return {}
      }
    }
  }
  return {}
}

const fetchPortfolios = async () => {
  isLoading.value = true
  try {
    const data = await $fetch('/project', {
      baseURL: config.public.baseUrl,
      method: 'GET',
      credentials: 'include'
    })
    portfolios.value = data
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to fetch projects',
      text: err?.message || 'Unknown error'
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Set user data dari localStorage saat komponen mount
  user.value = getUserFromLocalStorage()
  fetchPortfolios() // DISABLE agar shimmer selalu tampil
})

const handleEditPortfolio = (portfolio) => {
  navigateTo(`/portfolios/${portfolio.slug}/edit`)
}

const handleDeletePortfolio = async (portfolio) => {
  const result = await Swal.fire({
    title: 'Delete Portfolio',
    text: `Are you sure you want to delete "${portfolio.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })
  if (result.isConfirmed) {
    try {
      await $fetch(`/project/${portfolio.uuid}`, {
        baseURL: config.public.baseUrl,
        method: 'DELETE',
        credentials: 'include'
      })
      await Swal.fire({
        title: 'Deleted!',
        text: 'Portfolio has been deleted.',
        icon: 'success'
      })
      fetchPortfolios()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete',
        text: err?.message || 'Unknown error'
      })
    }
  }
}

// Format tanggal DD/MM/YYYY HH:mm
function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}
</script>

<style scoped>
/* Smooth transitions */
.bg-white,
.bg-gray-50,
.bg-gray-100,
.dark\:bg-gray-800,
.dark\:bg-gray-900 {
  transition: background-color 0.3s ease;
}

/* Gradient animation */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>