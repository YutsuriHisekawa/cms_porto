<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-extrabold text-primary-900 dark:text-primary-100 mb-2">Dashboard</h1>
      <p class="text-lg text-primary-600 dark:text-primary-400">Welcome back, {{ user?.name }}!</p>
    </div>

    <!-- Stats -->
    <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="card shadow-lg flex flex-col items-center">
        <div class="p-8 flex flex-col items-center gap-4">
          <div class="w-14 h-14 bg-accent-100 dark:bg-accent-900/20 rounded-xl flex items-center justify-center mb-2">
            <svg class="w-7 h-7 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p class="text-base font-medium text-primary-600 dark:text-primary-400">Total Portfolios</p>
          <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">{{ portfolios?.length || 0 }}</p>
        </div>
      </div>
      <div class="card shadow-lg flex flex-col items-center">
        <div class="p-8 flex flex-col items-center gap-4">
          <div class="w-14 h-14 bg-success-100 dark:bg-success-900/20 rounded-xl flex items-center justify-center mb-2">
            <svg class="w-7 h-7 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-base font-medium text-primary-600 dark:text-primary-400">Total Projects</p>
          <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">{{ totalProjects }}</p>
        </div>
      </div>
      <div class="card shadow-lg flex flex-col items-center">
        <div class="p-8 flex flex-col items-center gap-4">
          <div class="w-14 h-14 bg-warning-100 dark:bg-warning-900/20 rounded-xl flex items-center justify-center mb-2">
            <svg class="w-7 h-7 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p class="text-base font-medium text-primary-600 dark:text-primary-400">Featured Projects</p>
          <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">{{ featuredProjects?.length || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Portfolios -->
    <div class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-semibold text-primary-900 dark:text-primary-100">Recent Portfolios</h2>
        <NuxtLink to="/portfolios" class="text-accent-600 hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300 text-base font-medium">
          View all →
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-14 w-14 border-b-2 border-accent-600"></div>
      </div>

      <div v-else-if="(portfolios?.length || 0) === 0" class="text-center py-16">
        <svg class="w-20 h-20 text-primary-400 dark:text-primary-600 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="text-xl font-medium text-primary-900 dark:text-primary-100 mb-3">No portfolios yet</h3>
        <p class="text-primary-600 dark:text-primary-400 mb-6">Get started by creating your first portfolio</p>
        <NuxtLink to="/portfolios/create" class="btn btn-primary">
          Create Portfolio
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PortfolioCard
          v-for="portfolio in (portfolios?.slice(0, 3) || [])"
          :key="portfolio.id"
          :portfolio="portfolio"
          @edit="handleEditPortfolio"
          @delete="handleDeletePortfolio"
        />
      </div>
    </div>

    <!-- Featured Projects -->
    <div v-if="(featuredProjects?.length || 0) > 0" class="mb-8">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-semibold text-primary-900 dark:text-primary-100">Featured Projects</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="project in (featuredProjects?.slice(0, 3) || [])"
          :key="project.id"
          :project="project"
          @edit="handleEditProject"
          @delete="handleDeleteProject"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuthStore()
const { portfolios, isLoading, featuredProjects, fetchPortfolios } = usePortfolioStore()

const totalProjects = computed(() => {
  return portfolios.reduce((total, portfolio) => total + (portfolio.projects?.length || 0), 0)
})

const handleEditPortfolio = (portfolio) => {
  Swal.fire('Edit Portfolio', `Edit portfolio: ${portfolio.title}`, 'info')
  // navigateTo(`/portfolios/${portfolio.id}/edit`)
}

const handleDeletePortfolio = (portfolio) => {
  Swal.fire({
    title: 'Delete Portfolio',
    text: `Are you sure you want to delete "${portfolio.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      // TODO: panggil fungsi hapus sebenarnya
      Swal.fire('Deleted!', 'Portfolio has been deleted.', 'success')
    }
  })
}

const handleEditProject = (project) => {
  Swal.fire('Edit Project', `Edit project: ${project.title}`, 'info')
  // TODO: Implement project editing
}

const handleDeleteProject = (project) => {
  Swal.fire({
    title: 'Delete Project',
    text: `Are you sure you want to delete "${project.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      // TODO: panggil fungsi hapus sebenarnya
      Swal.fire('Deleted!', 'Project has been deleted.', 'success')
    }
  })
}

// Fetch portfolios on mount
onMounted(() => {
  fetchPortfolios()
})
</script>