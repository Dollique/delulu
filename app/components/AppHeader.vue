<script setup lang="ts"></script>
<template>
  <header>
    <h1>Delulu</h1>
    <AppNav />
  </header>
</template>

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
}
</style>
