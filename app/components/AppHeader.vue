<template>
  <header>
    <section class="header__right">
      <h1>Delulu</h1>
      <a href="#" class="header__filters" @click="handleClickFilters">Filters</a>
    </section>
    <AppNav />
  </header>
</template>

<script setup lang="ts">
const handleClickFilters = (e: Event) => {
  e.preventDefault()
  // show the content from MediaFilters.vue here as a dropdown
}
</script>

<style scoped>
header {
  background: #333;
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
  background: #555;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
