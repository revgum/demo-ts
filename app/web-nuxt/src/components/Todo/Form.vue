<script setup lang="ts">
import { z } from 'zod';
import type { Todo } from '~/server/types';
import type { FormSubmitEvent } from '#ui/types';

const { refresh, todo, closeModal } = defineProps<{
  refresh: () => void;
  todo?: Todo;
  closeModal?: () => void;
}>();

const schema = z.object({
  title: z.string().min(1).trim(),
  completed: z.boolean().default(false),
  due_at: z.union([z.string().date(), z.string().datetime()]).nullish(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  title: todo?.title,
  due_at: todo?.due_at || undefined,
  completed: todo?.completed ?? undefined,
});

const handleFormSubmit = async (event: FormSubmitEvent<Schema>) => {
  await useFetch<{ response: Todo }>(todo ? `/api/todo/${todo.id}` : '/api/todo', {
    method: todo ? 'PUT' : 'POST',
    body: {
      title: event.data.title,
      due_at: event.data.due_at,
      completed: event.data.completed,
    },
  });

  if (!todo) {
    state.due_at = undefined;
    state.title = undefined;
    state.completed = undefined;
  }
  refresh();

  if (closeModal) {
    closeModal();
  }
};
</script>

<template>
  <UForm :schema="schema" :state="state" class="mb-4 flex flex-col gap-2 text-base" @submit.prevent="handleFormSubmit">
    <UFormGroup label="Title" name="title" class="text-slate-400" :ui="{ label: { base: 'font-normal' } }">
      <UInput v-model="state.title" variant="outline" size="md" class="border rounded-md text-slate-800"/>
    </UFormGroup>

    <UFormGroup label="Due Date" name="due_at" class="text-slate-400" :ui="{ label: { base: 'font-normal' } }">
      <UInput v-model="state.due_at" type="date" size="md" class="border rounded-md text-slate-800" />
    </UFormGroup>

    <UFormGroup v-if="todo" label="Completed" name="completed" class="text-slate-400" :ui="{ label: { base: 'font-normal' } }">
      <UCheckbox v-model="state.completed" name="completed"/>
    </UFormGroup>

    <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
      {{ todo ? 'Update' : 'Add' }} Task
    </button>
  </UForm>
</template>
