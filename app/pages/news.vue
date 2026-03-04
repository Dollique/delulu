<template>
  <h1>News</h1>
  <p>News are not yet filtered to only positive News... API is too expensive :(</p>

  <!-- 2️⃣ Bind with v-model and add submit -->
  <form class="happyNews__form" @submit.prevent="handleSearch">
    <label for="searchquery">Search</label>
    <input
      type="text"
      id="searchquery"
      name="searchquery"
      placeholder="anime, games..."
      v-model="searchQuery"
    />

    <!-- Optional: a submit button for clarity -->
    <button type="submit" class="happyNews__search-btn">Search</button>
  </form>

  <section v-if="!error" class="happyNews__container">
    <div v-for="item in news" :key="item.id" class="happyNews__card">
      <img :src="item.image_url" class="happyNews__image" />
      <div class="happyNews__content">
        <h2>{{ item.title }}</h2>
        <p>{{ truncate(item.description) }}</p>
        <a
          :href="item.link"
          target="_blank"
          :title="`Link to ${item.source_name}`"
          class="happyNews__link"
          >Read More</a
        >
      </div>
    </div>
  </section>
  <section v-else>Not able to fetch news. {{ error ?? '' }}</section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useNews } from '~/composables/useNews'

const { news, error, fetchNews } = useNews()

const defaultSearchTopics = ['anime', 'steam', 'japan', 'manga', 'games'] // some default topics

const searchQuery = ref<string>(returnRandomItem(defaultSearchTopics)) // sets random topic as default

onMounted(() => {
  if (searchQuery.value === '') searchQuery.value = returnRandomItem(defaultSearchTopics)

  fetchNews(searchQuery.value)
})

const handleSearch = () => {
  fetchNews(searchQuery.value)
}

function returnRandomItem(searchArray: Array<string>): string {
  if (!searchArray.length) return ''
  // returns random entry of an array
  const randomIndex = Math.floor(Math.random() * searchArray.length)
  return searchArray[randomIndex]
}

function truncate(text: string | null | undefined): string {
  if (!text) return ''
  return text.length > 200 ? text.slice(0, 200) + '...' : text
}
</script>

<style>
h2 {
  font-size: 1rem;
}

.happyNews__form {
  margin: 1rem 0;
}

.happyNews__form label {
  display: block;
}

/* -----  NEW GRID STYLING  ----- */
.happyNews__container {
  display: grid;
  /*
   *  *minmax(200px, 1fr)*
   *   - 200px is the minimum width a card will be
   *   - 1fr lets the grid distribute leftover space evenly
   */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  justify-content: space-between; /* optional, can be removed */
}

/* -----  CARD STYLING  ----- */
.happyNews__card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-primary);
  /* The width is handled by the grid, so no flex-basis needed */
}

.happyNews__image {
  width: 100%;
  height: auto;
  /* optional: to keep images proportional */
  object-fit: cover;
}

.happyNews__content {
  display: flex;
  flex-direction: column;
  flex: 1; /* take all the free space inside the card */
  padding: 1rem;
}

/* push the <a> to the very bottom of the card */
.happyNews__link {
  margin-top: auto; /* pushes it to the bottom */

  display: block;
  padding: 0.5rem 0;
  text-align: center;
  background: var(--color-primary);
  text-decoration: none;
  border-radius: 4px;
  border: 2px solid var(--color-primary);
}

.happyNews__link:hover,
.happyNews__link:focus {
  background: none;
  border-color: var(--color-primary);
}
</style>
