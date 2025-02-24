<script setup lang="ts">
import { z } from 'zod';
import type { Todo } from '~/server/types';
import type { FormSubmitEvent } from '#ui/types';

const { refresh } = defineProps<{
  refresh: () => void;
}>();

const schema = z.object({
  title: z.string().min(1).trim(),
  completed: z.boolean().default(false),
  due_at: z.union([z.string().date(), z.string().datetime()]).nullish(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  title: undefined,
  due_at: undefined,
});

const handleFormSubmit = async (event: FormSubmitEvent<Schema>) => {
  await useFetch<{ response: Todo }>('/api/todo', {
    method: 'POST',
    body: {
      title: event.data.title,
      due_at: event.data.due_at,
      completed: event.data.completed,
    },
  });

  state.due_at = undefined;
  state.title = undefined;
  refresh();
};
</script>

<template>
  <UForm :schema="schema" :state="state" class="mb-4 flex flex-col gap-2 text-base" @submit.prevent="handleFormSubmit">
    <UFormGroup label="" name="title">
      <UInput v-model="state.title" variant="outline" size="md" class="border rounded-md"/>
    </UFormGroup>

    <UFormGroup label="" name="due_at">
      <UInput v-model="state.due_at" type="date" size="md" class="border rounded-md" />
    </UFormGroup>

    <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
      Add Task
    </button>
  </UForm>
</template>
