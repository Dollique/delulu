<template>
  <div class="media-card">
    <img :src="item.image_url" class="media-card__image" />
    <div class="media-card__content">
      <small>{{ formatPubDate(item.pubDate) }}</small>
      <h2>{{ item.title }}</h2>
      <p>{{ truncate(item.description) }}</p>
      <AppButton
        v-if="props.mediaType !== 'Videos'"
        tag="a"
        class="media-card__button"
        :href="item.link"
        target="_blank"
        :title="`Link to ${item.source_name}`"
      >
        Read More
      </AppButton>
      <AppButton
        v-else
        tag="NuxtLink"
        class="media-card__button"
        :to="{ path: '/focus/video/', query: { video_link: item.link } }"
        :title="`Watch ${item.title}`"
      >
        Watch Video
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: Object,
  mediaType: String
})

function truncate(text: string | null | undefined): string {
  if (!text) return ''
  return text.length > 200 ? text.slice(0, 200) + '...' : text
}

function formatPubDate(pubDate: string | null | undefined): string {
  if (!pubDate) return ''
  const date = new Date(pubDate)
  if (isNaN(date.getTime())) {
    return pubDate
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style>
h2 {
  font-size: 1rem;
}

.media-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-primary);
}

.media-card__image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.media-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
}

.media-card__button {
  margin-top: auto;
}
</style>
