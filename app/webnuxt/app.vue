<script setup lang="ts">
const router = useRouter()
const nav = [
  { label: 'Home', to: '/' },
  { label: 'Tests', to: '/tests' },
]
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
