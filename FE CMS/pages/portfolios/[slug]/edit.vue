<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, useRuntimeConfig } from '#imports'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const title = ref('')
const description = ref('')
const uploadHeader = ref(null)
const uploadHeaderPreview = ref(null)
const isSubmitting = ref(false)
const errors = ref({ title: '', description: '', upload_header: '' })

const projectDetails = ref([])

const fetchPortfolio = async () => {
  try {
    isSubmitting.value = true
    const data = await $fetch(`/project/${route.params.slug}`, {
      baseURL: config.public.baseUrl,
      method: 'GET',
      credentials: 'include'
    })
    title.value = data.title
    description.value = data.description
    uploadHeaderPreview.value = data.upload_header ? config.public.baseUrl + data.upload_header : null
    uploadHeader.value = null
    projectDetails.value = (data.project_d || []).map(d => ({ uuid: d.uuid, preview: config.public.baseUrl + d.picture_url, picture: null }))
    if (projectDetails.value.length === 0) projectDetails.value = [{ picture: null }]
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Failed to fetch project', text: err?.message || 'Unknown error' })
    router.replace('/portfolios')
  } finally {
    isSubmitting.value = false
  }
}

const addDetail = () => {
  projectDetails.value.push({ picture: null })
}
const removeDetail = (idx) => {
  projectDetails.value.splice(idx, 1)
  if (projectDetails.value.length === 0) projectDetails.value = [{ picture: null }]
}

const onHeaderChange = (e) => {
  const file = e.target.files[0]
  if (file && file.size > 2 * 1024 * 1024) {
    Swal.fire({ icon: 'error', title: 'Image Too Large', text: 'Max image size is 2 MB.' })
    uploadHeader.value = null
    uploadHeaderPreview.value = null
    return
  }
  if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    Swal.fire({ icon: 'error', title: 'Invalid Format', text: 'Only PNG and JPG images are allowed.' })
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
    Swal.fire({ icon: 'error', title: 'Image Too Large', text: 'Max image size is 2 MB.' })
    projectDetails.value[idx].picture = null
    projectDetails.value[idx].preview = null
    return
  }
  if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    Swal.fire({ icon: 'error', title: 'Invalid Format', text: 'Only PNG and JPG images are allowed.' })
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

const onRemoveHeader = () => {
  uploadHeader.value = null
  uploadHeaderPreview.value = null
}

const onRemoveDetail = (idx) => {
  projectDetails.value[idx].picture = null
  projectDetails.value[idx].preview = null
  if (projectDetails.value[idx].uuid) {
    removeDetail(idx)
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

const validate = () => {
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

const onSave = async () => {
  if (!validate()) return
  isSubmitting.value = true
  const swalLoading = Swal.fire({
    title: 'Saving...',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading() }
  })
  try {
    const fd = new FormData()
    fd.append('title', title.value)
    fd.append('description', description.value)
    if (uploadHeader.value) fd.append('upload_header', uploadHeader.value)
    const keepUuids = projectDetails.value.filter(d => d.uuid && !d.picture).map(d => d.uuid)
    fd.append('detail_uuids', JSON.stringify(keepUuids))
    projectDetails.value.forEach((d, i) => {
      if (d.picture) {
        fd.append(`project_d_picture_${i}`, d.picture)
      }
    })
    await $fetch(`/project/${route.params.slug}`, {
      baseURL: config.public.baseUrl,
      method: 'PUT',
      body: fd,
      credentials: 'include'
    })
    await Swal.close()
    await Swal.fire({ icon: 'success', title: 'Portfolio updated!' })
    router.push(`/portfolios/${route.params.slug}`)
  } catch (err) {
    await Swal.close()
    Swal.fire({ icon: 'error', title: 'Failed to update', text: err?.message || 'Unknown error' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchPortfolio()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br p-4 md:p-8">
    <!-- Header -->
    <div class="mx-auto mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink :to="`/portfolios/${route.params.slug}`" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-400">
            Edit Portfolio
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Update your creative work</p>
        </div>
      </div>
    </div>
    <!-- Form Card -->
    <div class="w-full mx-auto flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <div class="flex">
              <div class="flex-1 py-4 px-6 text-center border-b-2 border-primary-500 font-medium text-primary-600 dark:text-primary-400">
                Project Details
              </div>
            </div>
          </div>
          <div class="p-6 md:p-8">
            <form @submit.prevent="onSave" class="space-y-8" enctype="multipart/form-data">
              <!-- Title Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title <span class="text-red-500">*</span>
                </label>
                <input v-model="title" type="text" required class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all" :class="{ 'border-red-500': errors.title }" placeholder="My Awesome Project" />
                <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
              </div>
              <!-- Description Field -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea v-model="description" rows="5" required class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all" :class="{ 'border-red-500': errors.description }" placeholder="Tell us about your project..."></textarea>
                <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
              </div>
              <!-- Header Image -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Image
                  </label>
                  <div class="relative">
                    <label v-if="!uploadHeaderPreview" class="flex flex-col items-center justify-center w-full min-h-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                      <div class="flex flex-col items-center justify-center p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          <span class="font-semibold text-primary-500">Click to upload</span>
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, GIF (MAX. 2MB)</p>
                      </div>
                      <input id="upload_header" type="file" class="hidden" @change="onHeaderChange" accept="image/*" />
                    </label>
                    <div v-else class="relative w-full flex items-center justify-center min-h-48 h-auto bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-primary-400 dark:border-primary-500 group">
                      <img :src="uploadHeaderPreview" alt="Preview" class="max-h-[24rem] w-auto max-w-full object-contain rounded-lg cursor-pointer" @click="showPreview(uploadHeaderPreview)" />
                      <button @click.prevent="onRemoveHeader" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-opacity opacity-80 group-hover:opacity-100 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Project Details -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Images
                  </label>
                  <button type="button" @click="addDetail" class="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Image
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="(detail, idx) in projectDetails" :key="detail.uuid || idx" class="relative group">
                    <label v-if="!detail.preview" class="block h-40 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 overflow-hidden cursor-pointer hover:border-primary-400 transition-colors">
                      <div class="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input type="file" class="hidden" @change="e => onDetailFileChange(e, idx)" accept="image/*" />
                    </label>
                    <div v-else class="relative h-40 w-full group">
                      <img :src="detail.preview" alt="Preview" class="h-full w-full object-cover rounded-lg cursor-pointer border-2 border-primary-400 dark:border-primary-500" @click="showPreview(detail.preview)" />
                      <button @click.prevent="onRemoveDetail(idx)" class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-opacity opacity-80 group-hover:opacity-100 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button v-if="projectDetails.length > 1 && !detail.preview" @click="removeDetail(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Form Actions -->
              <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <NuxtLink :to="`/portfolios/${route.params.slug}`" class="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-center">
                  Cancel
                </NuxtLink>
                <button type="submit" :disabled="isSubmitting" class="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-70 flex items-center justify-center">
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isSubmitting ? 'Saving...' : 'Save Changes' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Image Preview Modal -->
    <div v-if="previewVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
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
input, textarea, button, label {
  transition: all 0.2s ease;
}
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
