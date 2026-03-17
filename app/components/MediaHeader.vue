<template>
  <div class="media-header">
    <h1>Media from {{ source }}</h1>
    <small>
      <a class="media-header__switcher" href="#" @click.prevent="onNextSource">
        Next {{ mediaType }} Source
      </a>
    </small>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  source: String,
  mediaType: String
})

const emit = defineEmits(['nextSource'])

const onNextSource = () => {
  emit('nextSource')
}
</script>

<style>
.media-header__switcher {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-size: 0.9rem;
}
</style>
