<template>
  <div>
    <MediaHeader :source="apiSource" mediaType="Videos" @nextSource="handleNextSource" />
    <p>Videos are not yet filtered to only positive Videos... API is too expensive :(</p>
    <SearchForm v-model="searchQuery" placeholder="anime, games..." @search="handleSearch" />
    <MediaGrid :items="media" :error="error ?? undefined" mediaType="Videos" />
    <AppPagination
      :hasNextPage="hasNextPage"
      :hasPrevPage="hasPrevPage"
      :currentPage="currentPage"
      @next="handleNextPage"
      @prev="handlePrevPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useMedia } from '~/composables/useMedia'
import { mapVideoItems } from '~/utils/mediaMappings'
import { useMediaNavigation } from '~/composables/useMediaNavigation'
import MediaHeader from '~/components/MediaHeader.vue'
import SearchForm from '~/components/SearchForm.vue'
import MediaGrid from '~/components/MediaGrid.vue'
import AppPagination from '~/components/AppPagination.vue'

const { id, handleNextSource, returnRandomItem } = useMediaNavigation('videos')
const { media, error, search, apiSource, pagination, handleNextPage, handlePrevPage } = useMedia(
  'videos',
  id.value,
  mapVideoItems
)
const { hasNextPage, hasPrevPage, currentPage } = pagination

const defaultSearchTopics = ['anime', 'steam', 'japan', 'manga', 'games']
const searchQuery = useState<string>('searchQuery')

// Set a random default only if the store is empty
if (!searchQuery.value) {
  searchQuery.value = returnRandomItem(defaultSearchTopics)
}

onMounted(() => {
  if (searchQuery.value === '') {
    searchQuery.value = returnRandomItem(defaultSearchTopics)
  }
  search(searchQuery.value)
})

const handleSearch = () => {
  search(searchQuery.value)
}
</script>
