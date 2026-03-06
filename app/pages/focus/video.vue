<template>
  <div class="video-container">
    <!-- Embed YouTube video using the videoLink -->
    <iframe
      v-if="isYouTubeLink(videoLink)"
      class="video-iframe"
      width="560"
      height="315"
      :src="getYouTubeEmbedUrl(videoLink)"
      frameborder="0"
      allow="
        accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture;
      "
      allowfullscreen
    ></iframe>
    <!-- Fallback if the link is not a YouTube URL -->
    <div v-else>
      <p>This is not a valid YouTube video link.</p>
      <p>Video Link: {{ videoLink }}</p>
    </div>

    <AppButton class="video-go-back" :isBackButton="true" @click="goBack">Go Back</AppButton>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const videoLink = route.query.video_link as string

// Check if the link is a YouTube URL
const isYouTubeLink = (url: string): boolean => {
  return url?.includes('youtube.com') || url?.includes('youtu.be')
}

// Convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return ''

  // Handle standard YouTube URLs (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Handle shortened YouTube URLs (e.g., https://youtu.be/dQw4w9WgXcQ)
  else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Fallback
  return ''
}
</script>

<style scoped>
.video-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 315px;
  margin: 20px 0;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.video-iframe {
  width: 100%;
  height: 100%;
}

.video-go-back {
  margin-top: 20px;
}
</style>
