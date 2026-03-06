<template>
  <section v-if="!error" class="media-grid">
    <MediaCard v-for="item in items" :key="item.id" :item="item" :mediaType="mediaType" />
  </section>
  <section v-else>Not able to fetch {{ mediaType }}. {{ error ?? '' }}</section>
</template>

<script lang="ts" setup>
defineProps({
  items: Array,
  error: String,
  mediaType: String
})
</script>

<style>
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-content: space-between;
}
</style>
