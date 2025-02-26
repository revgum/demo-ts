<script setup lang="ts">
import type { Todo } from '~/server/types';

const route = useRoute();
const { data, refresh } = await useFetch<{ response: Todo }>(`/api/todo/${route.params.id}`);
</script>

<template>
  <div class="min-h-screen w-full bg-slate-100 flex flex-col items-center">
    <div v-if="data" class="w-full max-w-lg mt-6 bg-white p-4 rounded-xl shadow-lg">
      <TodoForm :todo="data.response" :refresh="refresh" />
    </div>
  </div>
</template>
