<template>
  <header>
    <section class="header__right">
      <h1>Delulu</h1>
      <a href="#" class="header__filters" @click="handleClickFilters">Filters</a>
    </section>
    <AppNav />

    <!-- MediaFilters component that will be shown/hidden -->
    <MediaFilters
      v-if="showFilters"
      :show-filters="showFilters"
      @close-filters="handleCloseFilters"
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MediaFilters from './MediaFilters.vue'

const showFilters = ref(false)

const handleClickFilters = (e: Event) => {
  e.preventDefault()
  showFilters.value = true
}

const handleCloseFilters = () => {
  showFilters.value = false
}
</script>

<style scoped>
header {
  background: var(--color-gray);
  color: #fff;
  display: flex;
  gap: 20px;
  padding: 0 1rem;

  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

  align-items: center;
  position: fixed;
  top: 0;
  width: calc(100% - 2 * 1rem);
  z-index: 100;
}

.header__right {
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
  align-items: center;
}

.header__filters {
  background: var(--color-gray-light);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.header__filters,
.header__filters:active .header__filters:focus {
  color: #fff;
  text-decoration: none;
}

.header__filters:hover {
  background: var(--color-primary);
  color: black;
}
</style>
