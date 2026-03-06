<template>
  <form class="search-form" @submit.prevent="onSearch">
    <label for="searchquery">Search</label>
    <input
      id="searchquery"
      v-model="query"
      type="text"
      name="searchquery"
      :placeholder="placeholder"
    />
    <button type="submit" class="search-form__search-btn">Search</button>
  </form>
</template>

<script lang="ts" setup>
const props = defineProps({
  placeholder: String
})

const query = defineModel<string>('query')

const emit = defineEmits(['search'])

const onSearch = () => {
  emit('search', query.value)
}
</script>

<style>
.search-form {
  margin: 1rem 0;
}

.search-form label {
  display: block;
}
</style>
