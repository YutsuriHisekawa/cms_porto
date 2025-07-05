<template>
  <!-- Desktop Sidebar -->
  <aside class="hidden lg:flex flex-col h-screen w-64 bg-white dark:bg-primary-900 border-r border-primary-200 dark:border-primary-800 fixed inset-y-0 left-0 z-40">
    <!-- Logo (optional, for better branding) -->
    <div class="flex items-center justify-center h-16 border-b border-primary-200 dark:border-primary-800">
      <NuxtLink to="/dashboard" class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <span class="text-lg font-bold text-primary-900 dark:text-primary-100">Portfolio CMS</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.href"
        class="sidebar-link flex items-center px-3 py-2 rounded-lg font-medium text-primary-700 dark:text-primary-200 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors"
        :class="{ 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400': $route.path === item.href }"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.name }}
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-primary-200 dark:border-primary-800 mt-auto">
      <div class="flex items-center space-x-3">
        <img
          :src="getProfilePictureUrl(user?.profile_picture)"
          :alt="user?.nama"
          class="w-8 h-8 rounded-full object-cover object-center"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-primary-900 dark:text-primary-100 truncate">
            {{ user?.nama }}
          </p>
          <p class="text-xs text-primary-500 dark:text-primary-400 truncate">
            {{ user?.email }}
          </p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Sidebar -->
  <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-primary-900 border-r border-primary-200 dark:border-primary-800 flex flex-col h-screen transition-transform duration-300 ease-in-out lg:hidden" :class="{ '-translate-x-full': !isOpen, 'shadow-lg': isOpen }">
    <!-- Mobile header -->
    <div class="flex items-center justify-between p-4 border-b border-primary-200 dark:border-primary-800">
      <span class="text-lg font-semibold text-primary-900 dark:text-primary-100">Menu</span>
      <button
        @click="closeSidebar"
        class="p-2 rounded-md text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-100 dark:hover:bg-primary-800"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.href"
        class="sidebar-link flex items-center px-3 py-2 rounded-lg font-medium text-primary-700 dark:text-primary-200 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors"
        :class="{ 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400': $route.path === item.href }"
        @click="closeSidebar"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.name }}
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-primary-200 dark:border-primary-800 mt-auto">
      <div class="flex items-center space-x-3">
        <img
          :src="getProfilePictureUrl(user?.profile_picture)"
          :alt="user?.name"
          class="w-8 h-8 rounded-full object-cover object-center"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-primary-900 dark:text-primary-100 truncate">
            {{ user?.nama }}
          </p>
          <p class="text-xs text-primary-500 dark:text-primary-400 truncate">
            {{ user?.email }}
          </p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
    @click="closeSidebar"
  ></div>
</template>

<script setup>
import { 
  HomeIcon, 
  FolderIcon, 
  PlusIcon, 
  CogIcon 
} from '@heroicons/vue/24/outline'
import { useRuntimeConfig } from '#imports'

const { user } = useAuthStore()

const isOpen = ref(false)

const config = useRuntimeConfig()
function getProfilePictureUrl(pic) {
  if (!pic) return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  if (pic.startsWith('http')) return pic
  return config.public.baseUrl.replace(/\/$/, '') + pic
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Portfolios', href: '/portfolios', icon: FolderIcon },
  { name: 'Create Portfolio', href: '/portfolios/create', icon: PlusIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon }
]

const closeSidebar = () => {
  isOpen.value = false
}

// Listen for mobile sidebar toggle
onMounted(() => {
  document.addEventListener('toggle-mobile-sidebar', () => {
    isOpen.value = !isOpen.value
  })
})
</script>