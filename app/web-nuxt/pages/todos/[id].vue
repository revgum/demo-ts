<script setup lang="ts">
import type { Todo } from '~/server/types';

const route = useRoute();
const { data } = await useFetch<{ response: Todo }>(`/api/todo/${route.params.id}`);
</script>

<template>
  <div>
    <div v-if="data" style="font-size: 0.85rem;">
      <div>{{ data.response.id }}</div>
      <div>{{ data.response.title }}</div>
      <div>{{ data.response.created_at }}</div>
      <div>{{ data.response.updated_at }}</div>
    </div>
  </div>
</template>
