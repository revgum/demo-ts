<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
    field1: '',
})

const { data, status, error, refresh, clear } = await useFetch('/api/test');

async function handleFormSubmit() {
  const { data } = await useFetch('/api/test', {
    method: 'POST',
    body: {
      field1: formData.value.field1
    }
  });

  if(data.value.response.error) {
    alert(data.value.response.error);
  } else {
    formData.value.field1 = '';
    refresh();
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleFormSubmit">
      <input type="text" v-model="formData.field1" name="field1" />
      <button type="submit">Submit</button>
    </form>
    <div v-if="status.pending">Loading tests...</div>
    <div v-else style="font-size: 0.85rem;">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Field 1</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="test in data.response.payload.slice().reverse()"
            v-bind:key="test.id"
          >
            <td>
              <NuxtLink :to="{ name: 'tests-id', params: { id: test.id }}">{{ test.id }}</NuxtLink></td>
            <td>{{ test.field1 }}</td>
            <td>{{ test.created_at }}</td>
            <td>{{ test.updated_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
