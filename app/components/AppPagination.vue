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
</style>
