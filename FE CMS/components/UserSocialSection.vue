<template>
  <div>
    <template v-if="isEdit">
      <div class="space-y-4">
        <div 
          v-for="(social, index) in socials" 
          :key="social.id || index" 
          class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
        >
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <component :is="getPlatformIcon(social.platform)" class="h-4 w-4" />
              </div>
              <select 
                v-model="social.platform" 
                class="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1.25rem]"
                @change="updateIcon(social)"
              >
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
          </div>
          <div class="md:col-span-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile URL</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input 
                v-model="social.url" 
                class="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                placeholder="https://example.com/yourprofile" 
                type="url"
              />
            </div>
          </div>
          <div class="md:col-span-2 flex justify-end">
            <button 
              @click="$emit('remove', index)" 
              class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-red-500 dark:text-red-400"
              title="Remove social media"
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
        class="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors font-medium"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Social Media
      </button>
    </template>
    <template v-else>
      <div v-if="socials && socials.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          v-for="social in socials" 
          :key="social.id" 
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
        >
          <div class="flex-shrink-0 h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
            <component :is="getPlatformIcon(social.platform)" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="ml-4 min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ social.platform || 'Social Media' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ formatUrl(social.url) }}
            </p>
          </div>
          <div class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </a>
      </div>
      <div v-else class="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-xl text-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
        <svg class="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No social links added</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add your social media profiles to connect</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue';

const props = defineProps({
  socials: { type: Array, required: true },
  isEdit: { type: Boolean, default: false }
});

const platformIcons = {
  Facebook: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor' 
    }, [
      h('path', { 
        d: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
        class: 'text-[#1877F2]' 
      })
    ])
  }),
  Twitter: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor' 
    }, [
      h('path', { 
        d: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
        class: 'text-[#1DA1F2]' 
      })
    ])
  }),
  Instagram: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor' 
    }, [
      h('path', { 
        d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
        class: 'text-[#E1306C]' 
      })
    ])
  }),
  LinkedIn: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor' 
    }, [
      h('path', { 
        d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
        class: 'text-[#0077B5]' 
      })
    ])
  }),
  GitHub: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor' 
    }, [
      h('path', { 
        d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
        class: 'text-[#333] dark:text-[#f5f5f5]' 
      })
    ])
  }),
  YouTube: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor' 
    }, [
      h('path', { 
        d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
        class: 'text-[#FF0000]' 
      })
    ])
  }),
  Other: defineComponent({
    render: () => h('svg', { 
      class: 'h-5 w-5', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor' 
    }, [
      h('path', { 
        strokeLinecap: 'round', 
        strokeLinejoin: 'round', 
        strokeWidth: '2', 
        d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' 
      })
    ])
  })
};

const getPlatformIcon = (platform) => {
  return platformIcons[platform] || platformIcons.Other;
};

const formatUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '') + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch {
    return url;
  }
};
</script>