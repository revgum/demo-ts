<script setup lang="ts">
</script>

<template>
  <div>
    <nav class="flex flex-row w-full bg-blue-600 py-4 px-6 text-lg font-semibold shadow-lg justify-between">
      <span class="text-white">Todo App</span>
      <TodoDropdown />
    </nav>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UModals />
  </div>
</template>
