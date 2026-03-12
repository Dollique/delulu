<template>
  <div>
    <MediaHeader :source="apiSource" mediaType="News" @nextSource="handleNextSource" />
    <p>News are not yet filtered to only positive News... API is too expensive :(</p>

    <p v-if="errorMessage" class="error" v-html="errorMessage"></p>
    <section v-else>
      <SearchForm v-model="searchQuery" placeholder="anime, games..." @search="handleSearch" />
      <MediaGrid :items="media" :error="error ?? undefined" mediaType="News" />
      <AppPagination
        :hasNextPage="hasNextPage"
        :hasPrevPage="hasPrevPage"
        :currentPage="currentPage"
        @next="handleNextPage"
        @prev="handlePrevPage"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useMedia } from '~/composables/useMedia'
import { mapNewsItems } from '~/utils/mediaMappings'
import { useMediaNavigation } from '~/composables/useMediaNavigation'
import MediaHeader from '~/components/MediaHeader.vue'
import SearchForm from '~/components/SearchForm.vue'
import MediaGrid from '~/components/MediaGrid.vue'
import AppPagination from '~/components/AppPagination.vue'

const { id, handleNextSource, returnRandomItem } = useMediaNavigation('news')
const {
  media,
  error,
  errorMessage,
  search,
  apiSource,
  pagination,
  handleNextPage,
  handlePrevPage
} = useMedia('news', id.value, mapNewsItems)
const { hasNextPage, hasPrevPage, currentPage } = pagination

const defaultSearchTopics = ['anime', 'steam', 'japan', 'manga', 'games']
const searchQuery = useState<string>('searchQuery')

// Set a random default only if the store is empty
if (!searchQuery.value) {
  searchQuery.value = returnRandomItem(defaultSearchTopics)
}

onMounted(() => {
  search(searchQuery.value)
})

const handleSearch = () => {
  search(searchQuery.value)
}
</script>
