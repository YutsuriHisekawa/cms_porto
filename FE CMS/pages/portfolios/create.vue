<script setup>
import { ref, onMounted, watchEffect, onBeforeUnmount } from 'vue'
import { useRuntimeConfig } from '#imports'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const title = ref('')
const description = ref('')
const uploadHeader = ref(null)
const uploadHeaderPreview = ref(null)
const errors = ref({ title: '', description: '', upload_header: '' })
const isSubmitting = ref(false)
const userId = ref(null)

// Untuk detail project (bisa upload gambar lebih dari 1)
const projectDetails = ref([
  { picture: null }
])

const addDetail = () => {
  projectDetails.value.push({ picture: null })
}
const removeDetail = (idx) => {
  projectDetails.value.splice(idx, 1)
}

const onHeaderChange = (e) => {
  const file = e.target.files[0]
  if (file && file.size > 2 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Image Too Large',
      text: 'Max image size is 2 MB. Please choose a smaller file.',
      confirmButtonText: 'Okay, got it!'
    })
    uploadHeader.value = null
    uploadHeaderPreview.value = null
    return
  }
  if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Format',
      text: 'Only PNG and JPG images are allowed.',
      confirmButtonText: 'Okay, got it!'
    })
    uploadHeader.value = null
    uploadHeaderPreview.value = null
    return
  }
  uploadHeader.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      uploadHeaderPreview.value = ev.target.result
    }
    reader.readAsDataURL(file)
  } else {
    uploadHeaderPreview.value = null
  }
}

const onDetailFileChange = (e, idx) => {
  const file = e.target.files[0]
  if (file && file.size > 2 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Image Too Large',
      text: 'Max image size is 2 MB. Please choose a smaller file.',
      confirmButtonText: 'Okay, got it!'
    })
    projectDetails.value[idx].picture = null
    projectDetails.value[idx].preview = null
    return
  }
  if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Format',
      text: 'Only PNG and JPG images are allowed.',
      confirmButtonText: 'Okay, got it!'
    })
    projectDetails.value[idx].picture = null
    projectDetails.value[idx].preview = null
    return
  }
  projectDetails.value[idx].picture = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      projectDetails.value[idx].preview = ev.target.result
    }
    reader.readAsDataURL(file)
  } else {
    projectDetails.value[idx].preview = null
  }
}

const validatePortfolioCreate = () => {
  errors.value = { title: '', description: '', upload_header: '' }
  let valid = true
  if (!title.value || title.value.length < 2) {
    errors.value.title = 'Title must be at least 2 characters'
    valid = false
  }
  if (!description.value || description.value.length < 10) {
    errors.value.description = 'Description must be at least 10 characters'
    valid = false
  }
  return valid
}

// Helper: Convert base64 to File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

const onSave = async () => {
  if (!validatePortfolioCreate()) return
  isSubmitting.value = true
  const swalLoading = Swal.fire({
    title: 'Uploading...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
  try {
    // Get user ID from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const userObj = JSON.parse(userStr)
      userId.value = userObj.id // Store the user ID
    }

    if (!userId.value) {
      await Swal.close()
      await Swal.fire({
        icon: 'error',
        title: 'Authentication required',
        text: 'Please login again.',
        timer: 3000
      })
      isSubmitting.value = false
      return navigateTo('/login')
    }

    // Convert header preview to file if needed
    if (!uploadHeader.value && uploadHeaderPreview.value) {
      uploadHeader.value = dataURLtoFile(uploadHeaderPreview.value, 'header.jpg')
    }

    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('description', description.value)
    formData.append('user_id', userId.value)
    if (uploadHeader.value) {
      formData.append('upload_header', uploadHeader.value)
    }

    // Convert detail previews to file if needed
    projectDetails.value.forEach((d, i) => {
      if (!d.picture && d.preview) {
        d.picture = dataURLtoFile(d.preview, `detail_${i}.jpg`)
      }
      if (d.picture) {
        formData.append(`project_d_picture_${i}`, d.picture)
      }
    })
    formData.append('project_d_count', projectDetails.value.length)

    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/project', {
      baseURL: config.public.baseUrl,
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    await Swal.close()

    if (response?.project) {
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Project created successfully!',
        showConfirmButton: false,
        timer: 3000
      })
      // Clear all form values and drafts before redirect
      title.value = ''
      description.value = ''
      uploadHeader.value = null
      uploadHeaderPreview.value = null
      projectDetails.value = [{ picture: null }]
      localStorage.removeItem(DRAFT_KEY)
      await navigateTo('/portfolios')
    } else {
      throw new Error(response?.error || 'Unknown error')
    }
  } catch (err) {
    await Swal.close()
    await Swal.fire({
      icon: 'error',
      title: 'Failed to create project',
      text: err?.message || 'Unknown error',
      timer: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

const previewImage = ref(null)
const previewVisible = ref(false)

function showPreview(src) {
  previewImage.value = src
  previewVisible.value = true
}
function closePreview() {
  previewVisible.value = false
  previewImage.value = null
}

// Watch for header image size
watchEffect(() => {
  if (uploadHeader.value && uploadHeader.value.size > 2 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Image Too Large',
      text: 'Max image size is 2 MB. Please choose a smaller file.',
      confirmButtonText: 'Okay, got it!'
    })
    uploadHeader.value = null
    uploadHeaderPreview.value = null
  }
})

// Watch for detail images size
watchEffect(() => {
  projectDetails.value.forEach((detail, idx) => {
    if (detail.picture && detail.picture.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Image Too Large',
        text: 'Max image size is 2 MB. Please choose a smaller file.',
        confirmButtonText: 'Okay, got it!'
      })
      detail.picture = null
      detail.preview = null
    }
  })
})

const DRAFT_KEY = 'portfolio_drafts'

const saveDraft = () => {
  const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]')
  const now = new Date().toISOString()
  const draft = {
    id: Date.now(),
    title: title.value,
    description: description.value,
    uploadHeaderPreview: uploadHeaderPreview.value,
    projectDetails: projectDetails.value.map(d => ({ preview: d.preview })),
    date: now
  }
  drafts.unshift(draft)
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.slice(0, 10))) // keep max 10
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Draft saved!',
    showConfirmButton: false,
    timer: 2000
  })
  loadDrafts()
}

const drafts = ref([])
const loadDrafts = () => {
  drafts.value = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]')
}

const removeDraft = (id) => {
  const draftsArr = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]')
  const newDrafts = draftsArr.filter(d => d.id !== id)
  localStorage.setItem(DRAFT_KEY, JSON.stringify(newDrafts))
  loadDrafts()
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Draft deleted',
    showConfirmButton: false,
    timer: 2000
  })
}

const loadDraftToForm = (draft) => {
  title.value = draft.title
  description.value = draft.description
  uploadHeaderPreview.value = draft.uploadHeaderPreview
  uploadHeader.value = null // can't restore file, only preview
  projectDetails.value = draft.projectDetails.map(d => ({ picture: null, preview: d.preview }))
  // Remove all drafts after loading
  localStorage.removeItem(DRAFT_KEY)
  loadDrafts()
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Draft loaded',
    showConfirmButton: false,
    timer: 2000
  })
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr)
      console.log('user.id (onMounted):', userObj.id)
    } catch (e) { }
  }
  loadDrafts()
})

onBeforeUnmount(() => {
  if (title.value || description.value || uploadHeaderPreview.value || projectDetails.value.some(d => d.preview)) {
    saveDraft()
  }
})

const onHeaderClick = () => {
  if (!uploadHeaderPreview.value) {
    document.getElementById('upload_header').click();
  }
}

const onRemoveHeader = () => {
  uploadHeader.value = null
  uploadHeaderPreview.value = null
}

const onDetailImageClick = (idx) => {
  if (!projectDetails.value[idx].preview) {
    document.getElementById(`detail_upload_${idx}`).click();
  }
}

const onRemoveDetail = (idx) => {
  projectDetails.value[idx].picture = null
  projectDetails.value[idx].preview = null
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br  p-4 md:p-8">
    <!-- Header -->
    <div class="mx-auto mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/portfolios" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-400">
            Create New Portfolio
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Bring your creative vision to life</p>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="w-full mx-auto flex flex-col md:flex-row gap-8">
      <!-- Form Area -->
      <div class="flex-1">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <!-- Form Tabs -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <div class="flex">
              <div
                class="flex-1 py-4 px-6 text-center border-b-2 border-primary-500 font-medium text-primary-600 dark:text-primary-400">
                Project Details
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="p-6 md:p-8">
            <form @submit.prevent="onSave" class="space-y-8" enctype="multipart/form-data">
              <!-- Title Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title <span class="text-red-500">*</span>
                </label>
                <input v-model="title" type="text" required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
                  :class="{ 'border-red-500': errors.title }" placeholder="My Awesome Project" />
                <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
              </div>

              <!-- Description Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea v-model="description" rows="5" required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
                  :class="{ 'border-red-500': errors.description }"
                  placeholder="Tell us about your project..."></textarea>
                <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
              </div>

              <!-- Header Image -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Image
                  </label>
                  <div class="relative">
                    <label v-if="!uploadHeaderPreview"
                      class="flex flex-col items-center justify-center w-full min-h-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                      <div class="flex flex-col items-center justify-center p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-3" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          <span class="font-semibold text-primary-500">Click to upload</span> 
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, GIF (MAX. 2MB)</p>
                      </div>
                      <input id="upload_header" type="file" class="hidden" @change="onHeaderChange" accept="image/*" />
                    </label>
                    <div v-else
                      class="relative w-full flex items-center justify-center min-h-48 h-auto bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-primary-400 dark:border-primary-500 group">
                      <img :src="uploadHeaderPreview" alt="Preview"
                        class="max-h-[24rem] w-auto max-w-full object-contain rounded-lg cursor-pointer"
                        @click="showPreview(uploadHeaderPreview)" />
                      <button @click.prevent="onRemoveHeader"
                        class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-opacity opacity-80 group-hover:opacity-100 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p v-if="errors.upload_header" class="text-sm text-red-500">{{ errors.upload_header }}</p>
                </div>
              </div>

              <!-- Project Details -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Images
                  </label>
                  <button type="button" @click="addDetail"
                    class="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Image
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="(detail, idx) in projectDetails" :key="idx" class="relative group">
                    <label v-if="!detail.preview"
                      class="block h-40 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 overflow-hidden cursor-pointer hover:border-primary-400 transition-colors">
                      <div class="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input :id="`detail_upload_${idx}`" type="file" class="hidden" @change="e => onDetailFileChange(e, idx)" accept="image/*" />
                    </label>
                    <div v-else class="relative h-40 w-full group">
                      <img :src="detail.preview" alt="Preview"
                        class="h-full w-full object-cover rounded-lg cursor-pointer border-2 border-primary-400 dark:border-primary-500"
                        @click="showPreview(detail.preview)" />
                      <button @click.prevent="onRemoveDetail(idx)"
                        class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-opacity opacity-80 group-hover:opacity-100 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button v-if="projectDetails.length > 1 && !detail.preview" @click="removeDetail(idx)"
                      class="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <NuxtLink to="/portfolios"
                  class="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-center">
                  Cancel
                </NuxtLink>
                <button type="button" @click="saveDraft"
                  class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center">
                  Save as Draft
                </button>
                <button type="submit" :disabled="isSubmitting"
                  class="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-70 flex items-center justify-center">
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <span>{{ isSubmitting ? 'Creating...' : 'Create Project' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- Draft List Area -->
      <div class="w-full md:w-80 flex-shrink-0">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
          <div class="font-bold text-lg mb-2 text-gray-700 dark:text-gray-200">Drafts</div>
          <div v-if="drafts.length === 0" class="text-gray-400 text-sm">No drafts yet.</div>
          <ul v-else class="space-y-2">
            <li v-for="draft in drafts" :key="draft.id"
              class="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <button type="button" @click="loadDraftToForm(draft)" class="flex-1 text-left p-2 pr-1 overflow-hidden">
                <div class="font-medium text-gray-800 dark:text-gray-100 truncate" :title="draft.title || 'Untitled'">
                  {{ draft.title || 'Untitled' }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ new Date(draft.date).toLocaleString() }}
                </div>
              </button>
              <button @click.stop="removeDraft(draft.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete draft">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewVisible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div class="relative max-w-4xl w-full">
        <button @click="closePreview" class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="previewImage" class="w-full max-h-[90vh] object-contain rounded-lg" />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Smooth transitions for form elements */
input,
textarea,
button,
label {
  transition: all 0.2s ease;
}

/* Custom scrollbar for the modal */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
