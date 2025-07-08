<template>
  <div>
    <template v-if="isEdit">
      <div class="space-y-4">
        <div 
          v-for="(skill, index) in skills" 
          :key="skill.id || index" 
          class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
        >
          <div class="md:col-span-5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill Name</label>
            <input 
              v-model="skill.skill_name" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
              placeholder="e.g. JavaScript, Photoshop"
            />
          </div>
          <div class="md:col-span-5">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill Level</label>
            <select 
              v-model="skill.skill_level" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.5rem] bg-[length:1.25rem]"
            >
              <option value="">Select proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div class="md:col-span-2 flex justify-end">
            <button 
              @click="$emit('remove', index)" 
              class="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-red-500 dark:text-red-400"
              title="Remove skill"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <button 
        @click="$emit('add')" 
        class="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors font-medium"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Skill
      </button>
    </template>
    <template v-else>
      <div v-if="skills && skills.length > 0" class="flex flex-wrap gap-3">
        <div 
          v-for="skill in skills" 
          :key="skill.id" 
          class="relative group bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/50 px-4 py-2 rounded-lg flex items-center border border-primary-200 dark:border-primary-700/50 shadow-sm hover:shadow-md transition-all"
        >
          <span class="text-primary-800 dark:text-primary-100 text-sm font-medium">{{ skill.skill_name }}</span>
          <span 
            v-if="skill.skill_level" 
            class="ml-2 text-xs px-2 py-1 rounded-full bg-primary-200/70 dark:bg-primary-700/70 text-primary-700 dark:text-primary-200 font-medium"
          >
            {{ skill.skill_level }}
          </span>
          <div class="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 dark:group-hover:bg-primary-500/5 rounded-lg transition-colors"></div>
        </div>
      </div>
      <div v-else class="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-lg text-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
        <svg class="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No skills added</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add your first skill to get started</p>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  skills: { type: Array, required: true },
  isEdit: { type: Boolean, default: false }
})
</script>