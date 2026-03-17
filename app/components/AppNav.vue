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
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* media query for mobile only */
@media (max-width: 600px) {
  .navi__list {
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    font-size: 0.9rem;
  }
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
