<template>
  <div class="card card-hover">
    <div class="aspect-w-16 aspect-h-9">
      <img
        :src="project.image"
        :alt="project.title"
        class="w-full h-48 object-cover rounded-t-xl"
      />
    </div>
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
            {{ project.title }}
          </h3>
          <p class="text-primary-600 dark:text-primary-400 text-sm mb-4">
            {{ project.description }}
          </p>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <span
            v-if="project.featured"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/20 dark:text-accent-400"
          >
            Featured
          </span>
          <button
            @click="$emit('edit', project)"
            class="p-2 text-primary-600 hover:text-accent-600 hover:bg-accent-50 dark:text-primary-400 dark:hover:text-accent-400 dark:hover:bg-accent-900/20 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="$emit('delete', project)"
            class="p-2 text-primary-600 hover:text-error-600 hover:bg-error-50 dark:text-primary-400 dark:hover:text-error-400 dark:hover:bg-error-900/20 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.technologies"
          :key="tech"
          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200"
        >
          {{ tech }}
        </span>
      </div>
      
      <div class="flex items-center space-x-3">
        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary text-xs px-3 py-1"
        >
          Demo
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline text-xs px-3 py-1"
        >
          Code
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
}

defineProps<{
  project: Project
}>()

defineEmits<{
  edit: [project: Project]
  delete: [project: Project]
}>()
</script>