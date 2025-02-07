<script setup lang="ts">
const route = useRoute();
const { data, status, error, refresh, clear } = await useFetch(`/api/test/${route.params.id}`);
</script>

<template>
  <div>
    <div v-if="status.pending">Loading test...</div>
    <div v-else style="font-size: 0.85rem;">
      <div>{{ data.response.payload.id }}</div>
      <div>{{ data.response.payload.field1 }}</div>
      <div>{{ data.response.payload.created_at }}</div>
      <div>{{ data.response.payload.updated_at }}</div>
    </div>
  </div>
</template>
