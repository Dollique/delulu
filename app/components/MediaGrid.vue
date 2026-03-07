<template>
  <section v-if="!error" class="media-grid">
    <MediaCard v-for="item in sortedItems" :key="item.id" :item="item" :mediaType="mediaType" />
  </section>
  <section v-else>Not able to fetch {{ mediaType }}. {{ error ?? '' }}</section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMediaScore } from '~/composables/useMediaScore'

const props = defineProps({
  items: Array,
  error: String,
  mediaType: String
})

const { calculateScore } = useMediaScore()

// Get the configuration to check if sorting should be enabled
const config = useAppConfig()
const sortByMediaScore = config.filterOptions.sortByMediaScore || false

// Computed property to sort items by score when enabled
const sortedItems = computed(() => {
  if (!sortByMediaScore || !props.items) return props.items

  // Create a copy of items and sort by score (descending)
  return [...props.items].sort((a, b) => {
    const scoreA = calculateScore(a)
    const scoreB = calculateScore(b)
    // Sort by score descending (most positive first)
    return scoreB - scoreA
  })
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
