<template>
  <div>
    <template v-if="isEdit">
      <!-- Edit Mode -->
      <div v-if="experiences && experiences.length > 0" class="space-y-4">
        <TransitionGroup name="list" tag="div">
          <div 
            v-for="(exp, idx) in experiences" 
            :key="'exp-'+idx"
            class="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Company Name -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Company</label>
                <input 
                  v-model="exp.nama_perusahaan" 
                  class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g. Google, Microsoft"
                />
              </div>
              
              <!-- Position -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Position</label>
                <input 
                  v-model="exp.posisi" 
                  class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              
              <!-- Description -->
              <div class="md:col-span-2 space-y-1">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Description <span class="text-gray-400">(optional)</span></label>
                <textarea 
                  v-model="exp.deskripsi" 
                  class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[80px]"
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>
              
              <!-- Date Range -->
              <div class="grid grid-cols-2 gap-4 md:col-span-2">
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Start Date</label>
                  <div class="relative">
                    <input 
                      type="date"
                      :value="formatDateForInput(exp.tanggal_mulai)"
                      @input="e => exp.tanggal_mulai = e.target.value"
                      class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">End Date</label>
                  <div class="relative">
                    <input 
                      type="date"
                      :value="formatDateForInput(exp.tanggal_akhir)"
                      @input="e => exp.tanggal_akhir = e.target.value"
                      :disabled="exp.stay"
                      class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex items-center mt-2">
                    <input 
                      type="checkbox" 
                      v-model="exp.stay" 
                      :id="'stay-'+idx" 
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-all"
                    />
                    <label :for="'stay-'+idx" class="ml-2 text-sm text-gray-600 dark:text-gray-300">Currently working here</label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Delete Button -->
            <div class="flex justify-end mt-3">
              <button 
                @click="$emit('remove', idx)" 
                class="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-all"
              >
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
      
      <!-- Add New Button -->
      <button 
        @click="$emit('add')" 
        class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 transition-all duration-200"
      >
        <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Work Experience
      </button>
    </template>
    
    <template v-else>
      <!-- View Mode -->
      <div v-if="experiences && experiences.length > 0" class="space-y-4">
        <TransitionGroup name="list" tag="div">
          <div 
            v-for="(exp, idx) in experiences" 
            :key="'view-exp-'+idx"
            class="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ exp.posisi }}
                </h4>
                <p class="text-gray-700 dark:text-gray-300 font-medium">
                  {{ exp.nama_perusahaan }}
                </p>
                <p v-if="exp.deskripsi" class="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                  {{ exp.deskripsi }}
                </p>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full whitespace-nowrap">
                {{ formatDate(exp.tanggal_mulai) }} – {{ exp.stay ? 'Present' : formatDate(exp.tanggal_akhir) }}
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      
      <div v-else class="p-6 text-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No work experience added</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add your professional experience to showcase your career journey.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({
  experiences: { type: Array, default: () => [] },
  isEdit: { type: Boolean, default: false }
});
const emit = defineEmits(['add', 'remove', 'update:experiences']);
// Watch agar setiap perubahan experiences di child langsung update ke parent
watch(
  () => props.experiences,
  (val) => {
    emit('update:experiences', val);
  },
  { deep: true }
);
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.input {
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

/* Fix for date input in Safari */
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  -webkit-appearance: none;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>