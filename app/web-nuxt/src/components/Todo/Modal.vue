<script setup lang="ts">
import type { Todo } from '~/server/types';

const { todo } = defineProps<{
  refresh: () => void;
  closeModal: () => void;
  todo?: Todo;
}>();
</script>

<template>
    <UModal :ui="{ overlay: { background: 'bg-black opacity-75' } }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-slate-200 dark:divide-slate-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-slate-600 dark:text-white">
              Edit Todo
            </h3>
            <UButton color="red" variant="ghost" icon="line-md:close-circle-filled" class="-my-1 opacity-75" @click="closeModal" />
          </div>
        </template>
        <TodoForm :todo="todo" :refresh="refresh" :close-modal="closeModal" />
      </UCard>
    </UModal>
</template>
