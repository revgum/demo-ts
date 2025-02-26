<script setup lang="ts">
const items = [
  [
    {
      label: 'View All',
      icon: 'line-md:watch',
      to: '/',
    },
  ],
];
</script>

<template>
  <UDropdown class="z-9999 shadow-md" :items="items" :popper="{ placement: 'bottom-start' }" :ui="{ container: 'z-20 group shadow-md'}">
    <UButton label="Todos" trailing-icon="line-md:chevron-small-down" />
  </UDropdown>
</template>

