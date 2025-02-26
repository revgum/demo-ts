
<script setup lang="ts">
import type { Todo } from '~/server/types';
import { TodoModal } from '#components';

const { todo, refresh } = defineProps<{
  todo: Todo;
  refresh: () => void;
}>();

const modal = useModal();

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

const handleHeaderClick = () => {
  modal.open(TodoModal, {
    refresh,
    todo,
    closeModal,
  });
};

const closeModal = () => {
  modal.close();
};
</script>

<template>
  <div
    :key=todo.id
    class="flex w-full items-center justify-between p-4 transition-opacity"
    :class="todo.completed ? 'opacity-50' : 'opacity-100'"
  >
    <div>
      <!-- <NuxtLink :to="{ name:'todos-id', params: { id: todo.id}}"> -->
        <h3 @click="handleHeaderClick" class="text-lg font-medium underline cursor-pointer">{{todo.title}}</h3>
      <!-- </NuxtLink> -->
      <p v-if="todo.completed && todo.updated_at" class="text-sm text-slate-500">Completed {{ todo.updated_at.substring(0,10) }}</p>
      <p v-else-if="todo.due_at" class="text-sm text-slate-500">Due {{ todo.due_at.substring(0,10) }}</p>
      <p v-else class="text-sm text-slate-500">No due date</p>
    </div>
    <div class="relative inline-flex h-6 w-11 items-center text-2xl">
      <UTooltip :text="todo.completed ? 'Remove complete' : 'Mark as complete'" :ui="{background: 'bg-black dark:bg-zinc-100', color: 'text-zinc-100 dark:text-black'}">
        <button
          type="button"
          @click="handleToggleTodo(todo)"
          :class="todo.completed ? 'text-green-500' : 'text-slate-400 hover:text-green-500'"
        >
          <Icon name="line-md:square-filled-to-confirm-square-filled-transition" />
        </button>
      </UTooltip>
      <UTooltip text="Delete task" :ui="{background: 'bg-black dark:bg-zinc-100', color: 'text-zinc-100 dark:text-black'}">
        <button
          type="button"
          @click="handleDeleteTodo(todo)"
          class="text-red-700 opacity-75 ml-2"
        >
          <Icon name="line-md:close-circle-filled"/>
        </button>
      </UTooltip>
    </div>
  </div>
</template>
