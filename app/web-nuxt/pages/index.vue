<script setup lang="ts">
import type { Todo } from '~/server/types';

const { data, refresh } = await useFetch<{ response: Todo[] }>('/api/todo');
</script>

<template>
  <div class="min-h-screen w-full bg-slate-100 flex flex-col items-center">
    <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
    <div class="w-full max-w-lg mt-6 bg-white p-4 rounded-xl shadow-lg">
      <TodoForm :refresh="refresh"/>
      <div
        v-if="data?.response.length"
        v-for="todo in data.response"
        class="flex border-b border-slate-300 last:border-none"
      >
        <TodoItem :todo="todo" :refresh="refresh" />
      </div>
      <div v-else>
        <h3 class="text-lg font-medium text-slate-700">No tasks found, add a new task.</h3>
      </div>
    </div>
  </div>
</template>
