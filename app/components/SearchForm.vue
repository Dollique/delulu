<template>
  <form class="search-form" @submit.prevent="onSearch">
    <label for="searchquery">Search</label>
    <input
      id="searchquery"
      v-model="localQuery"
      type="text"
      name="searchquery"
      :placeholder="placeholder"
      @input="updateQuery"
    />
    <button type="submit" class="search-form__search-btn">Search</button>
  </form>
</template>

<script lang="ts" setup>
const props = defineProps({
  placeholder: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'search'])

const localQuery = ref(props.modelValue || '')

const updateQuery = () => {
  emit('update:modelValue', localQuery.value)
}

const onSearch = () => {
  emit('search')
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
