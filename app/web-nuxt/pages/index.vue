<script setup lang="ts">
const { data, status, error, refresh, clear } = await useFetch<{
  response: { payload: { id: number; field1: string; completed: boolean; created_at: string }[] };
}>('/api/test');

const handleToggleTask = (task) => {
  task.completed = !task.completed;
};
</script>

<template>
  <div class="min-h-screen w-full bg-gray-200 flex flex-col items-center">
    <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
    <div v-if="status.pending">Loading tests...</div>
    <div v-else  class="w-full max-w-lg mt-6 bg-white p-4 rounded-xl shadow-lg">
      <form class="mb-4 flex flex-col gap-2">
        <input type="text" value="" class="p-2 border rounded-md w-full" />
        <input type="date" value="" class="p-2 border rounded-md w-full" />
        <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Add Task
        </button>
      </form>
      <div
        v-for="task in data.response.payload"
        :key=task.id
        class="flex items-center justify-between p-4 border-b last:border-none transition-opacity"
        :class="task.completed ? 'opacity-50' : 'opacity-100'"
      >
        <div>
          <h3 class="text-lg font-medium">{{task.field1}}</h3>
          <p class="text-sm text-gray-500">Due: {{  task.created_at.substring(0,10)  }}</p>
        </div>
        <button
          type="button"
          @click="handleToggleTask(task)"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          :class="task.completed ? 'bg-green-500' : 'bg-gray-300'"
        >
          <span
            class="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
            :class="task.completed ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
