<template>
  <div class="app-pagination">
    <button :disabled="!hasPrevPage" @click="onPrev">Previous Page</button>
    <span class="page-indicator">Page {{ currentPage }}</span>
    <button :disabled="!hasNextPage" @click="onNext">Next Page</button>
  </div>
</template>

<script setup>
const props = defineProps({
  hasNextPage: Boolean,
  hasPrevPage: Boolean,
  currentPage: Number
})
const emit = defineEmits(['next', 'prev'])

const onNext = () => {
  emit('next')
}

const onPrev = () => {
  emit('prev')
}
</script>

<style scoped>
.app-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}
.page-indicator {
  font-weight: bold;
  font-size: 1.1rem;
}
button {
  background-color: var(--color-positive);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
}
button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
.debug-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #888;
}
pre {
  margin: 0;
}
</style>
