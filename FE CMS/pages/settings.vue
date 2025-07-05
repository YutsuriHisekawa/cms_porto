<template>
  <div class="w-full  mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 text-primary-900 dark:text-primary-100">Account Settings</h1>
    
    <div v-if="loading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-12 w-12 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="user" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-primary-500 to-accent-600 p-6 text-center relative">
        <div class="absolute top-4 right-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-primary-800 shadow-sm">
            <svg class="h-3 w-3 mr-1 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Verified
          </span>
        </div>
        <div class="flex justify-center">
          <img :src="user.profile_picture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'"
               class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer"
               :alt="user.nama_lengkap"
               @click="triggerFileInput" />
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </div>
        <h2 class="mt-4 text-2xl font-bold text-white">{{ user.nama_lengkap }}</h2>
        <p class="text-primary-100">{{ user.role }}</p>
      </div>
      
      <!-- Profile Details -->
      <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Info Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
            <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Full Name</p>
              <p class="text-base font-medium text-primary-900 dark:text-primary-100">{{ user.nama_lengkap }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Username</p>
              <p class="text-base font-medium text-primary-900 dark:text-primary-100">@{{ user.username }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Email</p>
              <p class="text-base font-medium text-primary-900 dark:text-primary-100">{{ user.email }}</p>
            </div>
          </div>
        </div>
        
        <!-- Bio Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
            <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </h3>
          
          <div v-if="user.description" class="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg">
            <p class="text-primary-700 dark:text-primary-300">{{ user.description }}</p>
          </div>
          <div v-else class="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg text-center">
            <p class="text-primary-500 dark:text-primary-400 italic">No bio yet</p>
          </div>
          

        </div>
      </div>
      
      <!-- Stats Footer -->
      <div class="bg-primary-50 dark:bg-primary-900/20 px-6 py-4 grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="flex justify-center mb-1">
            <svg class="h-5 w-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-sm text-primary-500 dark:text-primary-400">Member since</p>
          <p class="font-medium text-primary-900 dark:text-primary-100">
            {{ user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '-' }}
          </p>
        </div>
        <div class="text-center">
          <div class="flex justify-center mb-1">
            <svg class="h-5 w-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm text-primary-500 dark:text-primary-400">Last active</p>
          <p class="font-medium text-primary-900 dark:text-primary-100">Today</p>
        </div>
        <div class="text-center">
          <div class="flex justify-center mb-1">
            <svg class="h-5 w-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm text-primary-500 dark:text-primary-400">Role</p>
          <p class="font-medium text-primary-900 dark:text-primary-100 capitalize">{{ user.role }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-16">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
        <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="mt-3 text-lg font-medium text-primary-900 dark:text-primary-100">User not found</h3>
      <p class="mt-1 text-sm text-primary-500 dark:text-primary-400">We couldn't find your user data</p>
      <div class="mt-6">
        <button class="btn-primary flex items-center justify-center mx-auto">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return to Home
        </button>
      </div>
    </div>

    <ProfilePictureModal :show="showModal" @close="showModal = false" @save="handleSaveProfilePicture" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import ProfilePictureModal from '~/components/ProfilePictureModal.vue'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const user = ref(null)
const loading = ref(true)
const showModal = ref(false)
const auth = useAuthStore()
const fileInput = ref(null)

onMounted(async () => {
  try {
    const authUser = JSON.parse(localStorage.getItem('user'))
    if (!authUser || !authUser.id) throw new Error('No user found')
    const data = await $fetch(`/users/${authUser.slug}`, {
      baseURL: config.public.baseUrl
    })
    user.value = data
  } catch (err) {
    user.value = null
  } finally {
    loading.value = false
  }
})

function triggerFileInput() {
  fileInput.value && fileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    showModal.value = true
    // Pass file to modal via event or global ref
    // We'll use a workaround: set a global ref for the file
    window._profilePicFile = file
  }
}

async function handleSaveProfilePicture(blob) {
  if (!user.value) return
  const formData = new FormData()
  formData.append('profile_picture', blob, 'profile.jpg')
  try {
    const token = localStorage.getItem('token')
    await $fetch(`/users/${user.value.slug}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // Refresh user data
    const data = await $fetch(`/users/${user.value.slug}`, {
      baseURL: config.public.baseUrl
    })
    user.value = data
    // Optionally update localStorage
    localStorage.setItem('user', JSON.stringify(data))
  } catch (err) {
    // handle error (show toast, etc)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500;
}
</style>