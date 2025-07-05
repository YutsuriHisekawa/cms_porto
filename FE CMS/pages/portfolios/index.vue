<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Portfolios</h1>
        <p class="text-primary-600 dark:text-primary-400 mt-2">Manage your portfolio collections</p>
      </div>
      <NuxtLink to="/portfolios/create" class="btn btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Portfolio
      </NuxtLink>
    </div>

    <!-- Search and Filter -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search portfolios..."
            class="input"
          />
        </div>
        <div class="flex space-x-2">
          <select v-model="sortBy" class="input">
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPortfolios.length === 0 && !searchQuery" class="text-center py-12">
      <svg class="w-16 h-16 text-primary-400 dark:text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="text-lg font-medium text-primary-900 dark:text-primary-100 mb-2">No portfolios yet</h3>
      <p class="text-primary-600 dark:text-primary-400 mb-4">Get started by creating your first portfolio</p>
      <NuxtLink to="/portfolios/create" class="btn btn-primary">
        Create Portfolio
      </NuxtLink>
    </div>

    <!-- No Search Results -->
    <div v-else-if="filteredPortfolios.length === 0 && searchQuery" class="text-center py-12">
      <svg class="w-16 h-16 text-primary-400 dark:text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="text-lg font-medium text-primary-900 dark:text-primary-100 mb-2">No results found</h3>
      <p class="text-primary-600 dark:text-primary-400">Try adjusting your search terms</p>
    </div>

    <!-- Portfolios Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PortfolioCard
        v-for="portfolio in filteredPortfolios"
        :key="portfolio.slug"
        :portfolio="portfolio"
        @edit="handleEditPortfolio"
        @delete="handleDeletePortfolio"
      >
        <template #header>
          <NuxtLink :to="`/portfolios/${portfolio.slug}`">
            <img
              v-if="portfolio.upload_header"
              :src="config.public.baseUrl + portfolio.upload_header"
              alt="Header Image"
              class="w-full h-40 object-cover rounded-t-lg mb-2"
            />
          </NuxtLink>
        </template>
      </PortfolioCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const portfolios = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('updated')

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
    Swal.fire({ icon: 'error', title: 'Failed to fetch projects', text: err?.message || 'Unknown error' })
  } finally {
    isLoading.value = false
  }
}

const filteredPortfolios = computed(() => {
  let filtered = [...portfolios.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(portfolio =>
      portfolio.title.toLowerCase().includes(query) ||
      portfolio.description.toLowerCase().includes(query)
    )
  }
  // Hanya portfolio yang punya slug
  filtered = filtered.filter(p => !!p.slug)
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'updated':
        return new Date(b.updatedAt || b.created_at) - new Date(a.updatedAt || a.created_at)
      case 'created':
        return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  return filtered
})

const handleEditPortfolio = (portfolio) => {
  navigateTo(`/portfolios/${portfolio.slug}/edit`)
}

const handleDeletePortfolio = async (portfolio) => {
  const result = await Swal.fire({
    title: 'Delete this portfolio?',
    text: `Are you sure you want to delete "${portfolio.title}"? This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true
  })
  if (result.isConfirmed) {
    try {
      await $fetch(`/project/${portfolio.uuid}`, {
        baseURL: config.public.baseUrl,
        method: 'DELETE',
        credentials: 'include'
      })
      await fetchPortfolios()
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Portfolio deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to delete', text: err?.message || 'Unknown error' })
    }
  }
}

onMounted(() => {
  fetchPortfolios()
})
</script>