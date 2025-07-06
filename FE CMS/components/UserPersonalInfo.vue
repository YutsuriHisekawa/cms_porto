<template>
  <div class="space-y-6">
    <!-- About Section (Moved to Top) -->
    <div class="space-y-4">
      <h3
        class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
        <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        About
      </h3>
      <template v-if="isEdit">
        <textarea v-model="editUser.description" class="input input-bordered w-full min-h-[80px]"
          placeholder="Tell us about yourself..." />
      </template>
      <template v-else>
        <div v-if="user.description" class="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg">
          <p class="text-primary-700 dark:text-primary-300">{{ user.description }}</p>
        </div>
        <div v-else class="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg text-center">
          <p class="text-primary-500 dark:text-primary-400 italic">No bio yet</p>
        </div>
      </template>
    </div>
  </div>
  <!-- Personal Information Section (Below About) -->
  <div class="space-y-6">
    <h3
      class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
      <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Personal Information
    </h3>
  </div>

  <!-- Edit Mode -->
  <template v-if="isEdit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Full Name -->
      <div>
        <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Full Name</label>
        <div class="relative">
          <input v-model="editUser.nama_lengkap" class="input w-full pl-10" placeholder="Enter your full name" />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Nama (Single Name) -->
      <div>
        <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Nama Panggilan</label>
        <div class="relative">
          <input v-model="editUser.nama" class="input w-full pl-10" placeholder="Enter your name" />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Username -->
      <div>
        <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Username</label>
        <div class="relative">
          <input v-model="editUser.username" class="input w-full pl-10" placeholder="Enter username" />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Email -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Email</label>
        <div class="relative">
          <input v-model="editUser.email" class="input w-full pl-10" placeholder="Enter email address" />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- No. Telp -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">No. HP</label>
        <div class="relative">
          <input v-model="editUser.no_telp" class="input w-full pl-10" placeholder="Contoh: 081234567890" type="tel"
            inputmode="numeric" pattern="[0-9]*"
            @input="e => { editUser.no_telp = e.target.value.replace(/[^0-9]/g, '') }" maxlength="15" />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change Section -->
    <div class="pt-4 border-t border-primary-200 dark:border-primary-700">
      <h4 class="text-md font-medium text-primary-700 dark:text-primary-300 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Change Password
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Old Password -->
        <div>
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Current
            Password</label>
          <div class="relative">
            <input :type="showOldPassword ? 'text' : 'password'" v-model="localOldPassword"
              class="input w-full pl-10 pr-10" placeholder="Enter current password" autocomplete="current-password" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <button type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              @click="showOldPassword = !showOldPassword" aria-label="Toggle password visibility">
              <svg v-if="showOldPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95m3.25-2.568A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.422 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0" />
              </svg>
            </button>
          </div>
          <div v-if="passwordError && passwordError.toLowerCase().includes('current')"
            class="text-red-500 text-sm mt-2 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ passwordError }}</span>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">New Password</label>
          <div class="relative">
            <input :type="showNewPassword ? 'text' : 'password'" v-model="localNewPassword"
              class="input w-full pl-10 pr-10" placeholder="Enter new password" autocomplete="new-password" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <button type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              @click="showNewPassword = !showNewPassword" aria-label="Toggle password visibility">
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95m3.25-2.568A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.422 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Confirm New
            Password</label>
          <div class="relative">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="localConfirmPassword"
              class="input w-full pl-10 pr-10" placeholder="Confirm new password" autocomplete="new-password" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <button type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              @click="showConfirmPassword = !showConfirmPassword" aria-label="Toggle password visibility">
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.543 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95m3.25-2.568A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.422 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0" />
              </svg>
            </button>
          </div>
          <div v-if="passwordError && !passwordError.toLowerCase().includes('current')"
            class="text-red-500 text-sm mt-2 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ passwordError }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Section (Edit Mode) -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
        <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Skills
      </h3>
      <div v-for="(skill, index) in editUser.skill_d" :key="skill.id || index" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Skill Name</label>
          <input v-model="skill.skill_name" class="input w-full" placeholder="e.g. JavaScript" />
        </div>
        <div>
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Skill Level</label>
          <select v-model="skill.skill_level" class="input w-full">
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <div class="flex space-x-2">
          <button @click="removeSkill(index)" class="btn-secondary">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <button @click="addSkill" class="btn-primary mt-3">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Skill
      </button>
    </div>

    <!-- Social Media Section (Edit Mode) -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
        <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
        </svg>
        Social Media
      </h3>
      <div v-for="(social, index) in editUser.sosial_d" :key="social.id || index" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Platform</label>
          <select v-model="social.platform" class="input w-full">
            <option value="">Select platform</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="GitHub">GitHub</option>
            <option value="YouTube">YouTube</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">URL</label>
          <input v-model="social.url" class="input w-full" placeholder="https://" />
        </div>
        <div class="flex space-x-2">
          <button @click="removeSocial(index)" class="btn-secondary">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <button @click="addSocial" class="btn-primary mt-3">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Social Media
      </button>
    </div>
  </template>

  <!-- View Mode -->
  <template v-else>

    <!-- Full Name -->
    <div class="flex items-start">
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
        <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Full Name</p>
        <p class="text-base font-medium text-primary-900 dark:text-primary-100">{{ user.nama_lengkap }}</p>
      </div>
    </div>

    <!-- Nama (Single Name) -->
    <div class="flex items-start">
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
        <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Nama Panggilan</p>
        <p class="text-base font-medium text-primary-900 dark:text-primary-100">{{ user.nama }}</p>
      </div>
    </div>

    <!-- Username -->
    <div class="flex items-start">
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
        <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Username</p>
        <p class="text-base font-medium text-primary-900 dark:text-primary-100">@{{ user.username }}</p>
      </div>
    </div>

    <!-- Email -->
    <div class="flex items-start">
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
        <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-primary-500 dark:text-primary-400">Email</p>
        <p class="text-base font-medium text-primary-900 dark:text-primary-100">{{ user.email }}</p>
      </div>
    </div>

    <!-- No. Telp -->
    <div class="flex items-start">
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-primary-500 dark:text-primary-400">No. Telp</p>
        <p class="text-base font-medium text-primary-900 dark:text-primary-100">{{ user.no_telp || '-' }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <h3
        class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
        <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Skills
      </h3>

      <template v-if="isEdit">
        <div v-for="(skill, index) in editUser.skill_d" :key="skill.id || index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Skill Name</label>
            <input v-model="skill.skill_name" class="input w-full" placeholder="e.g. JavaScript" />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Skill Level</label>
            <select v-model="skill.skill_level" class="input w-full">
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button @click="removeSkill(index)" class="btn-secondary">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <button @click="addSkill" class="btn-primary mt-3">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </button>
      </template>
      <template v-else>
        <div v-if="user.skill_d && user.skill_d.length > 0" class="flex flex-wrap gap-2">
          <div v-for="skill in user.skill_d" :key="skill.id"
            class="bg-primary-100 dark:bg-primary-900/50 px-3 py-1.5 rounded-full flex items-center">
            <span class="text-primary-800 dark:text-primary-200 text-sm">{{ skill.skill_name }}</span>
            <span v-if="skill.skill_level" class="ml-1 text-xs text-primary-600 dark:text-primary-400">({{
              skill.skill_level }})</span>
          </div>
        </div>
        <div v-else class="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg text-center">
          <p class="text-primary-500 dark:text-primary-400 italic">No skills added</p>
        </div>
      </template>
    </div>

    <!-- Social Media Section -->
    <div class="space-y-4">
      <h3
        class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
        <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
        </svg>
        Social Media
      </h3>

      <template v-if="isEdit">
        <div v-for="(social, index) in editUser.sosial_d" :key="social.id || index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">Platform</label>
            <select v-model="social.platform" class="input w-full">
              <option value="">Select platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="GitHub">GitHub</option>
              <option value="YouTube">YouTube</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-primary-600 dark:text-primary-300 mb-1">URL</label>
            <input v-model="social.url" class="input w-full" placeholder="https://" />
          </div>
          <div class="flex space-x-2">
            <button @click="removeSocial(index)" class="btn-secondary">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <button @click="addSocial" class="btn-primary mt-3">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Social Media
        </button>
      </template>
      <template v-else>
        <div v-if="user.sosial_d && user.sosial_d.length > 0" class="space-y-3">
          <div v-for="social in user.sosial_d" :key="social.id" class="flex items-center">
            <div
              class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <SocialIcon :platform="social.platform" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="ml-4 min-w-0">
              <p class="text-sm font-medium text-primary-500 dark:text-primary-400 truncate">{{ social.platform }}</p>
              <a :href="social.url" target="_blank"
                class="text-sm text-primary-700 dark:text-primary-300 hover:text-accent-600 dark:hover:text-accent-400 truncate block">
                {{ social.url }}
              </a>
            </div>
          </div>
        </div>
        <div v-else class="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg text-center">
          <p class="text-primary-500 dark:text-primary-400 italic">No social media added</p>
        </div>
      </template>
    </div>

  </template>
</template>

<script setup>
import { ref, watch, toRefs, watchEffect, computed, defineComponent, h } from 'vue'

const props = defineProps({
  user: { type: Object, required: true },
  isEdit: { type: Boolean, required: true },
  editUser: { type: Object, required: true },
  passwordError: { type: String, default: '' },
  oldPassword: { type: String, default: '' },
  newPassword: { type: String, default: '' },
  confirmPassword: { type: String, default: '' },
})

const emit = defineEmits(['update:oldPassword', 'update:newPassword', 'update:confirmPassword'])

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const localOldPassword = ref(props.oldPassword)
const localNewPassword = ref(props.newPassword)
const localConfirmPassword = ref(props.confirmPassword)

watch(localOldPassword, val => emit('update:oldPassword', val))
watch(localNewPassword, val => emit('update:newPassword', val))
watch(localConfirmPassword, val => emit('update:confirmPassword', val))

watch(() => props.oldPassword, val => { if (val !== localOldPassword.value) localOldPassword.value = val })
watch(() => props.newPassword, val => { if (val !== localNewPassword.value) localNewPassword.value = val })
watch(() => props.confirmPassword, val => { if (val !== localConfirmPassword.value) localConfirmPassword.value = val })

const { isEdit, user, editUser } = toRefs(props)
watchEffect(() => {
  if (isEdit.value && user.value && editUser.value && editUser.value.nama === undefined) {
    editUser.value.nama = user.value.nama || ''
  }
})

// SocialIcon as a standard Vue component
const SocialIcon = defineComponent({
  props: ['platform'],
  setup(props) {
    const icons = {
      Facebook: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
      Twitter: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
      Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
      LinkedIn: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      GitHub: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      YouTube: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
      Other: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'
    };
    return () => h('svg', {
      class: 'h-5 w-5',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '1.5',
        d: icons[props.platform] || icons.Other
      })
    ])
  }
})

// Register SocialIcon locally for template usage
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 pl-10;
}

.btn-primary {
  @apply inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500;
}

.btn-secondary {
  @apply inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500;
}
</style>