<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Create Portfolio</h1>
      <p class="text-primary-600 dark:text-primary-400 mt-2">Create a new portfolio collection</p>
    </div>

    <!-- Form -->
    <div class="max-w-2xl">
      <div class="card">
        <div class="p-8">
          <form @submit="onSubmit" class="space-y-6">
            <div>
              <label for="title" class="label">Portfolio Title</label>
              <input
                id="title"
                v-model="title"
                type="text"
                name="title"
                required
                class="input"
                :class="{ 'input-error': errors.title }"
                placeholder="Enter portfolio title"
              />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>

            <div>
              <label for="description" class="label">Description</label>
              <textarea
                id="description"
                v-model="description"
                name="description"
                rows="4"
                required
                class="input"
                :class="{ 'input-error': errors.description }"
                placeholder="Describe your portfolio..."
              ></textarea>
              <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
            </div>

            <div class="flex justify-end space-x-4">
              <NuxtLink to="/portfolios" class="btn btn-outline">
                Cancel
              </NuxtLink>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn btn-primary"
              >
                <span v-if="isSubmitting" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
                <span v-else>Create Portfolio</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
  middleware: 'auth'
})

const { createPortfolio } = usePortfolioStore()
const { success, error } = useToast()

const schema = yup.object({
  title: yup.string().min(2, 'Title must be at least 2 characters').required('Title is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required')
})

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema
})

const title = ref('')
const description = ref('')

const onSubmit = handleSubmit(async (values) => {
  const result = await createPortfolio(values)
  
  if (result.success) {
    success('Portfolio created successfully!')
    await navigateTo('/portfolios')
  } else {
    error(result.error || 'Failed to create portfolio')
  }
})
</script>