<script setup lang="ts"></script>
<template>
  <nav class="navi">
    <ul class="navi__list">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li><NuxtLink to="/blogs">Blogs</NuxtLink></li>
      <li><NuxtLink to="/videos">Videos</NuxtLink></li>
      <li><NuxtLink to="/about">About</NuxtLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.navi {
  padding: 0.5rem 0;
}

.navi__list {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  color: var(--color-primary);
}

a.router-link-exact-active {
  border-bottom: 2px solid var(--color-primary);
}
</style>
