<template>
  <div v-if="shouldShowCard" class="media-card">
    <div v-if="showColorGradeLabel" class="score-badge" :style="{ backgroundColor: scoreColor }">
      {{ scoreLabel }}
    </div>
    <img :src="item.image_url || item.urlToImage" class="media-card__image" />
    <div class="media-card__content">
      <small>{{ formatPubDate(item.pubDate || item.publishedAt) }}</small>
      <h2>{{ item.title }}</h2>
      <p>{{ truncate(item.description) }}</p>
      <AppButton
        v-if="props.mediaType !== 'Videos'"
        tag="a"
        class="media-card__button"
        :href="item.url"
        target="_blank"
        :title="`Link to ${item.title}`"
      >
        Read More
      </AppButton>
      <AppButton
        v-else
        tag="a"
        class="media-card__button"
        :href="item.url"
        target="_blank"
        :title="`Watch ${item.title}`"
      >
        Watch Video
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: any
  mediaType?: string
}>()

const { showColorGradeLabel, showScoreInLabel, hideItemsWithScoreLTE } = useUserPreferences()
const { calculateScore, getColorGrade, getColorGradeLabel } = useMediaScore()

// Computed properties for displaying score info
const score = computed(() => {
  return calculateScore(props.item)
})

const scoreColor = computed(() => {
  return getColorGrade(score.value)
})

function truncate(text: string | null | undefined): string {
  if (!text) return ''
  return text.length > 200 ? text.slice(0, 200) + '...' : text
}

function formatPubDate(pubDate: string | null | undefined): string {
  if (!pubDate) return ''
  const date = new Date(pubDate)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const scoreLabel = computed(() => {
  if (!showScoreInLabel.value) return ''

  const scoreValue = score.value
  const label = getColorGradeLabel(scoreValue)

  if (showColorGradeLabel.value) {
    return `${label} (${scoreValue}%)`
  }

  return null
})

const shouldShowCard = computed(() => {
  const scoreValue = score.value
  return scoreValue > hideItemsWithScoreLTE.value
})
</script>

<style scoped>
.media-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-badge {
  padding: 4px 8px;
  border-radius: 4px;
  color: black;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  z-index: 1;
}

.media-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.media-card__content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
}

.media-card__content h2 {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
}

.media-card__content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.media-card__button {
  margin-top: auto;
}
</style>
