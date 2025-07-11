<template>
  <div class="w-full  mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 text-primary-900 dark:text-primary-100">Account Settings</h1>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-12 w-12 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <div v-else-if="user"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      <!-- Profile Header (Full Cover) -->
      <div class="relative w-full" :style="coverImageStyle">
        <!-- Cover Edit Icon -->
        <span
          class="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow cursor-pointer border border-gray-200 dark:border-gray-700 z-10"
          @click="triggerCoverFileInput" title="Change Cover">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3" />
          </svg>
        </span>
        <input ref="coverFileInput" type="file" accept="image/*" class="hidden" @change="onCoverFileChange" />
        <!-- Verified Badge -->
        <div class="absolute top-4 right-4">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-primary-800 shadow-sm">
            <svg class="h-3 w-3 mr-1 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd" />
            </svg>
            Verified
          </span>
        </div>
        <!-- Profile Picture Centered Overlapping -->
        <div class="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-1/2 z-20">
          <div class="relative w-32 h-32">
            <img :src="getProfilePictureUrl(user.profile_picture)"
              class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer"
              :alt="user.nama_lengkap" @click="showPreviewModal = true" />
            <span
              class="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow cursor-pointer border border-gray-200 dark:border-gray-700 z-10"
              @click.stop="triggerFileInput" title="Change Photo">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3" />
              </svg>
            </span>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          </div>
        </div>
        <!-- Spacer for cover height -->
        <div class="h-[260px] w-full"></div>
      </div>
      <!-- User Name & Role (below cover) -->
      <div class="mt-20 text-center">
        <h2 class="text-2xl font-bold text-primary-900 dark:text-white drop-shadow-lg">{{ user.nama_lengkap }}</h2>
        <p class="text-primary-500 dark:text-primary-100 drop-shadow">{{ user.role }}</p>
      </div>

      <!-- Profile Details -->
      <div class="p-6 md:p-8 grid grid-cols-1 gap-6 relative">
        <!-- Edit Icon -->
        <span v-if="!isEdit" @click="startEdit" title="Edit Info"
          class="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow cursor-pointer border border-gray-200 dark:border-gray-700 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3" />
          </svg>
        </span>
        <!-- Tombol Simpan/Cancel -->
        <div v-if="isEdit" class="absolute top-4 right-4 flex gap-2 z-20">
          <button class="btn-primary" @click="saveEdit">Simpan</button>
          <button class="btn-primary bg-gray-300 text-primary-900 hover:bg-gray-400" @click="cancelEdit">Cancel</button>
        </div>
        <!-- Personal Info & Password Change Section -->
        <UserPersonalInfo
          :user="user"
          :isEdit="isEdit"
          :editUser="editUser"
          v-model:oldPassword="oldPassword"
          v-model:newPassword="newPassword"
          v-model:confirmPassword="confirmPassword"
          :passwordError="passwordError"
          :key="user ? user.updated_at || user.id : 'none'"
        />
        <!-- Bio Section -->

      </div>

      <!-- Stats Footer -->
      <div class="bg-primary-50 dark:bg-primary-900/20 px-6 py-4 grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="flex justify-center mb-1">
            <svg class="h-5 w-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-sm text-primary-500 dark:text-primary-400">Member since</p>
          <p class="font-medium text-primary-900 dark:text-primary-100">
            {{ user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short'
            }) : '-' }}
          </p>
        </div>
        <div class="text-center">
          <div class="flex justify-center mb-1">
            <svg class="h-5 w-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm text-primary-500 dark:text-primary-400">Last active</p>
          <p class="font-medium text-primary-900 dark:text-primary-100">Today</p>
        </div>
        <div class="text-center">
          <div class="flex justify-center mb-1">
            <svg class="h-5 w-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="mt-3 text-lg font-medium text-primary-900 dark:text-primary-100">User not found</h3>
      <p class="mt-1 text-sm text-primary-500 dark:text-primary-400">We couldn't find your user data</p>
      <div class="mt-6">
        <button class="btn-primary flex items-center justify-center mx-auto">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return to Home
        </button>
      </div>
    </div>

    <ProfilePictureModal :show="showModal" :imageFile="selectedFile" @close="closeProfileModal"
      @save="handleSaveProfilePicture" @change-picture="triggerFileInput" />

    <template v-if="showPreviewModal">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div class="relative flex flex-col items-center">
          <button class="absolute top-2 right-2 text-white hover:text-accent-400 z-10" style="right:2rem;top:2rem"
            @click="showPreviewModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img :src="getProfilePictureUrl(user.profile_picture)"
            class="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-accent-600 bg-white dark:bg-gray-900"
            style="object-fit:contain;" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import ProfilePictureModal from '~/components/ProfilePictureModal.vue'
import { useAuthStore } from '~/stores/auth'
import UserPersonalInfo from '~/components/UserPersonalInfo.vue'

const config = useRuntimeConfig()
const auth = useAuthStore()
const user = computed(() => auth.user)
const loading = ref(true)
const showModal = ref(false)
const showPreviewModal = ref(false)
const fileInput = ref(null)
const coverFileInput = ref(null)
const selectedFile = ref(null)
const coverImage = ref(null)
const coverBgSize = ref('cover')
// Edit state
const isEdit = ref(false)
const editUser = ref({ nama_lengkap: '', username: '', email: '', description: '' })
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

function getCoverImage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('cover-image')
  }
  return null
}

function setCoverImage(base64) {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('cover-image', base64)
    coverImage.value = base64
    checkCoverImageRatio(base64)
  }
}

function checkCoverImageRatio(base64) {
  const img = new window.Image()
  img.onload = function () {
    const containerRatio = 5
    const imgRatio = img.width / img.height
    if (imgRatio < containerRatio) {  
      coverBgSize.value = '100% 100%'
    } else {
      coverBgSize.value = 'cover'
    }
  }
  img.src = base64
}

onMounted(async () => {
  // Sync Pinia store from localStorage if needed
  if (!auth.user && typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      auth.user = JSON.parse(userStr)
    }
  }
  try {
    const authUser = auth.user || JSON.parse(localStorage.getItem('user'))
    if (!authUser || !authUser.id) throw new Error('No user found')
    const data = await $fetch(`/users/${authUser.slug}`, {
      baseURL: config.public.baseUrl
    })
    auth.user = data
    localStorage.setItem('user', JSON.stringify(data))
    // Load cover image from localStorage if available
    const cover = getCoverImage()
    coverImage.value = cover
    if (cover) checkCoverImageRatio(cover)
  } catch (err) {
    auth.user = null
  } finally {
    loading.value = false
  }
})

function triggerFileInput() {
  fileInput.value && fileInput.value.click()
}

function triggerCoverFileInput() {
  coverFileInput.value && coverFileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    showModal.value = true
  }
}

function onCoverFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    setCoverImage(ev.target.result)
  }
  reader.readAsDataURL(file)
}

function closeProfileModal() {
  showModal.value = false
  selectedFile.value = null
}

async function handleSaveProfilePicture(blob) {
  if (!user.value) return
  const formData = new FormData()
  formData.append('profile_picture', blob, 'profile.jpg')
  try {
    const token = localStorage.getItem('auth-token')
    await $fetch(`/users/${user.value.slug}`, {
      method: 'PUT',
      body: formData,
      baseURL: config.public.baseUrl, // ensure using env baseURL
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    // Refresh user data
    const data = await $fetch(`/users/${user.value.slug}`, {
      baseURL: config.public.baseUrl
    })
    auth.user = data
    localStorage.setItem('user', JSON.stringify(data))
    closeProfileModal()
  } catch (err) {
    // handle error (show toast, etc)
  }
}

function getProfilePictureUrl(pic) {
  if (!pic) return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  if (pic.startsWith('http')) return pic
  return config.public.baseUrl.replace(/\/$/, '') + pic
}

const coverImageStyle = computed(() => {
  if (coverImage.value) {
    return {
      backgroundImage: `url('${coverImage.value}')`,
      backgroundSize: coverBgSize.value,
      backgroundPosition: 'center',
      minHeight: '220px',
      transition: 'background-image 0.3s',
    }
  } else {
    return {
      background: 'linear-gradient(to right, var(--color-primary-500), var(--color-accent-600))',
      minHeight: '220px',
    }
  }
})

function startEdit() {
  if (!user.value) return
  isEdit.value = true
  editUser.value = {
    nama_lengkap: user.value.nama_lengkap,
    username: user.value.username,
    email: user.value.email,
    description: user.value.description || '',
    nama: user.value.nama || '',
    no_telp: user.value.no_telp || '',
    // Deep copy skill_d and sosial_d to avoid mutating user directly
    skill_d: user.value.skill_d ? JSON.parse(JSON.stringify(user.value.skill_d)) : [],
    sosial_d: user.value.sosial_d ? JSON.parse(JSON.stringify(user.value.sosial_d)) : []
  }
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
}
function cancelEdit() {
  isEdit.value = false
  passwordError.value = ''
}
async function saveEdit() {
  passwordError.value = ''
  let profileUpdated = false
  // Jika ada perubahan password
  if (newPassword.value || confirmPassword.value || oldPassword.value) {
    if (!oldPassword.value) {
      passwordError.value = 'Masukkan password lama.'
      return
    }
    if (!newPassword.value) {
      passwordError.value = 'Masukkan password baru.'
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      passwordError.value = 'Password baru dan konfirmasi tidak sama.'
      return
    }
    // Kirim PATCH ke /users/:slug/password
    try {
      const token = localStorage.getItem('auth-token')
      await $fetch(`/users/${user.value.slug}/password`, {
        method: 'PATCH',
        body: {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value
        },
        baseURL: config.public.baseUrl,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
    } catch (err) {
      passwordError.value = err.data?.error || 'Gagal mengubah password.'
      return
    }
  }
  // Update data profil jika ada perubahan
  const token = localStorage.getItem('auth-token')
  try {
    const formData = new FormData()
    formData.append('nama', editUser.value.nama)
    formData.append('nama_lengkap', editUser.value.nama_lengkap)
    formData.append('username', editUser.value.username)
    formData.append('email', editUser.value.email)
    formData.append('description', editUser.value.description)
    formData.append('no_telp', editUser.value.no_telp)
    // Kirim skill_d dan sosial_d sebagai JSON string
    formData.append('skill_d', JSON.stringify(editUser.value.skill_d || []))
    formData.append('sosial_d', JSON.stringify(editUser.value.sosial_d || []))
    await $fetch(`/users/${user.value.slug}`, {
      method: 'PUT',
      body: formData,
      baseURL: config.public.baseUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    // Refresh user data
    const data = await $fetch(`/users/${user.value.slug}`, {
      baseURL: config.public.baseUrl
    })
    auth.user = data
    localStorage.setItem('user', JSON.stringify(data))
    isEdit.value = false
  } catch (err) {
    passwordError.value = err.data?.error || 'Gagal update profil.'
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500;
}

.input {
  @apply w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500;
}
</style>
