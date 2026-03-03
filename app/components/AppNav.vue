<template>
  <nav class="navi">
    <ul class="navi__list">
      <li><NuxtLink to="/about">About</NuxtLink></li>
      <li><NuxtLink to="/blogs">Blogs</NuxtLink></li>
      <li><NuxtLink to="/videos">Videos</NuxtLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.navi {
  background: #333;
  padding: 0.5rem 1rem;
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
  color: #ffcc00;
}

a.router-link-exact-active {
  border-bottom: 2px solid #ffcc00;
}
</style>
