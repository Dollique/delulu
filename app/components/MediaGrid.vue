<template>
  <div class="media-grid">
    <MediaCard
      v-for="item in sortedItems"
      :key="item.url || item.id"
      :item="item"
      :media-type="mediaType"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaScore } from '../composables/useMediaScore'
import { useUserPreferences } from '../composables/useUserPreferences'

const props = defineProps<{
  items?: any[]
  error?: string
  mediaType?: string
}>()

const { calculateScore } = useMediaScore()
const { sortByMediaScore } = useUserPreferences()

// Computed property to sort items by score when enabled
const sortedItems = computed(() => {
  if (!sortByMediaScore.value || !props.items) return props.items

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
