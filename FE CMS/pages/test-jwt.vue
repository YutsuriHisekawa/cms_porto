<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Test JWT Invalid</h1>
    <button class="btn-primary" @click="testInvalidJwt">Test JWT Invalid</button>
  </div>
</template>

<script setup lang="ts">
import { testInvalidJwt } from '~/composables/testJwt'
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-accent-600 text-white rounded hover:bg-accent-700 transition;
}
</style>
