<script setup lang="ts"></script>
<template>
  <nav class="navi">
    <ul class="navi__list">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li>
        <NuxtLink
          to="/news"
          active-class="router-link-active"
          :class="{
            'router-link-active': $route.path.startsWith('/news')
          }"
        >
          News
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/videos"
          :class="{
            'router-link-active': $route.path.startsWith('/videos')
          }"
          >Videos</NuxtLink
        >
      </li>
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

/* Use .router-link-active for all active states */
a.router-link-active {
  border-bottom: 2px solid var(--color-primary);
}
</style>
