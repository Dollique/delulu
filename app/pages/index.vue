<template>
  <h1>Home</h1>
  <section v-if="!error">
    <div v-for="item in news.value" :key="item.id">
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </section>
  <section v-else>Not able to fetch news. {{ error.value ?? '' }}</section>
</template>

<script lang="ts" setup>
const { news, error, fetchNews } = useNews()

onMounted(() => {
  fetchNews()
})
</script>

<style></style>
