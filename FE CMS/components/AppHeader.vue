<template>
  <header class="bg-white dark:bg-primary-900 shadow-sm border-b border-primary-200 dark:border-primary-800 sticky top-0 z-40">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Mobile menu button -->
      <button
        @click="toggleMobileSidebar"
        class="lg:hidden p-2 rounded-md text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-100 dark:hover:bg-primary-800 transition-colors"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Logo -->
      <div class="flex items-center">
        <NuxtLink to="/dashboard" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span class="text-xl font-bold text-primary-900 dark:text-primary-100">Portfolio CMS</span>
        </NuxtLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Theme toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-md text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-100 dark:hover:bg-primary-800 transition-colors"
        >
          <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- User menu -->
        <div class="relative" v-if="isAuthenticated">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 p-2 rounded-md text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <img
              :src="getProfilePictureUrl(user?.profile_picture)"
              :alt="user?.name"
              class="w-8 h-8 rounded-full object-cover object-center"
            />
            <span class="hidden sm:block text-sm font-medium">{{ user?.name }}</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User dropdown -->
          <Transition name="slide-down">
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-800 rounded-md shadow-lg border border-primary-200 dark:border-primary-700 z-50"
            >
              <div class="py-1">
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import Swal from 'sweetalert2'
import { useRuntimeConfig } from '#imports'
const { isDark, toggleTheme } = useTheme()
const { user, isAuthenticated, logout } = useAuthStore()

const config = useRuntimeConfig()
function getProfilePictureUrl(pic) {
  if (!pic) return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  if (pic.startsWith('http')) return pic
  return config.public.baseUrl.replace(/\/$/, '') + pic
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
})

const showUserMenu = ref(false)

const toggleMobileSidebar = () => {
  document.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))
}

const handleLogout = async () => {
  await logout()
  showUserMenu.value = false
  Toast.fire({
    icon: 'success',
    title: 'Logged out successfully!'
  })
}

onClickOutside(showUserMenu, () => {
  showUserMenu.value = false
})
</script>