<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-container">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 85px;
}
.main-container {
  background-color: var(--color-secondary);
  border: 2px solid var(--color-primary);
  box-shadow:
    0 4px 8px 0 rgba(255, 220, 80, 0.3),
    0 6px 20px 0 rgba(255, 220, 80, 0.19);
  padding: 10px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 1rem 2rem;

  position: relative;
}
</style>
