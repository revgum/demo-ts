<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '~/server/types';

const formData = ref({
  title: '',
  due_at: '',
  completed: false,
});

const { data, status, refresh } = await useFetch<{ response: Todo[] }>('/api/todo');

const handleDeleteTodo = async (todo: Todo) => {
  await useFetch<{ response: Todo }>(`/api/todo/${todo.id}`, { method: 'DELETE' });
  refresh();
};

const handleToggleTodo = async (todo: Todo) => {
  todo.completed = !todo.completed;
  await useFetch<{ response: Todo }>(`/api/todo/${todo.id}`, {
    method: 'PUT',
    body: {
      completed: todo.completed,
    },
  });
  refresh();
};

const handleFormSubmit = async () => {
  await useFetch<{ response: Todo }>('/api/todo', {
    method: 'POST',
    body: {
      title: formData.value.title,
      due_at: formData.value.due_at,
      completed: formData.value.completed,
    },
  });

  formData.value.title = '';
  formData.value.due_at = '';
  formData.value.completed = false;
  refresh();
};
</script>

<template>
  <div class="min-h-screen w-full bg-gray-200 flex flex-col items-center">
    <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
    <div v-if="status.pending">Loading tasks...</div>
    <div v-else class="w-full max-w-lg mt-6 bg-white p-4 rounded-xl shadow-lg">
      <form class="mb-4 flex flex-col gap-2" @submit.prevent="handleFormSubmit">
        <input type="text"  v-model="formData.title" name="title" class="p-2 border rounded-md w-full" />
        <input type="date" v-model="formData.due_at" class="p-2 border rounded-md w-full" />
        <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Add Task
        </button>
      </form>
      <div
        v-if="data?.response.length"
        v-for="todo in data.response"

        :key=todo.id
        class="flex items-center justify-between p-4 border-b last:border-none transition-opacity"
        :class="todo.completed ? 'opacity-50' : 'opacity-100'"
      >
        <div>
          <h3 class="text-lg font-medium">{{todo.title}}</h3>
          <p v-if="todo.due_at" class="text-sm text-gray-500">Due {{  todo.due_at.substring(0,10)  }}</p>
          <p v-else class="text-sm text-gray-500">No due date</p>
        </div>
        <div class="relative inline-flex h-6 w-11 items-center text-2xl">
        <button
          type="button"
          @click="handleToggleTodo(todo)"
          :class="todo.completed ? 'text-green-500' : 'text-gray-300'"
        >
          <Icon name="line-md:square-filled-to-confirm-square-filled-transition" />
        </button>
        <button
          type="button"
          @click="handleDeleteTodo(todo)"
          class="text-red-700 opacity-75 ml-2"
        >
          <Icon name="line-md:close-circle-filled"/>
        </button>
        </div>
      </div>
      <div
        v-else
        class="flex items-center justify-between p-4 border-b last:border-none transition-opacity"
      >
        <div>
          <h3 class="text-lg font-medium text-slate-700">No tasks found, add a new task.</h3>
        </div>
      </div>
    </div>
  </div>
</template>
