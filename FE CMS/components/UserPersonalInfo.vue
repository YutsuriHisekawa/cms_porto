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

      <!-- Skill Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
          <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Skills
        </h3>
        <UserSkillSection :skills="isEdit ? editUser.skill_d : user.skill_d" :isEdit="isEdit" @add="addSkill" @remove="removeSkill" />
      </div>

      <!-- Social Media Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 border-b pb-2 border-primary-200 dark:border-primary-700 flex items-center">
          <svg class="h-5 w-5 mr-2 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
          </svg>
          Social Media
        </h3>
        <UserSocialSection :socials="isEdit ? editUser.sosial_d : user.sosial_d" :isEdit="isEdit" @add="addSocial" @remove="removeSocial" />
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
                <!-- Removed NuxtIcon, use generic SVG icon -->
                <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                  <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
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

    
  </div>
</template>

<script setup>
import { ref, watch, toRefs, watchEffect } from 'vue'
import UserSkillSection from './UserSkillSection.vue'
import UserSocialSection from './UserSocialSection.vue'

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

function addSkill() {
  if (!editUser.value.skill_d) editUser.value.skill_d = []
  editUser.value.skill_d.push({ skill_name: '', skill_level: '' })
}
function removeSkill(idx) {
  if (editUser.value.skill_d) editUser.value.skill_d.splice(idx, 1)
}
function addSocial() {
  if (!editUser.value.sosial_d) editUser.value.sosial_d = []
  editUser.value.sosial_d.push({ platform: '', url: '' })
}
function removeSocial(idx) {
  if (editUser.value.sosial_d) editUser.value.sosial_d.splice(idx, 1)
}


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