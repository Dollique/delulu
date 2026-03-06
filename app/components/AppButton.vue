<template>
  <component :is="actualTag" v-bind="computedTagProps" class="app-button" @click="handleClick">
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, resolveComponent } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
    validator: (value: string) => ['button', 'a', 'NuxtLink'].includes(value)
  },
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  },
  isBackButton: {
    type: Boolean,
    default: false
  }
})

// 1. Resolve 'NuxtLink' to the actual component constructor
const actualTag = computed(() => {
  if (props.tag === 'NuxtLink') {
    return resolveComponent('NuxtLink')
  }
  return props.tag
})

// 2. Clean up props so they don't leak into the HTML attributes
const computedTagProps = computed(() => {
  if (props.tag === 'NuxtLink') {
    return { to: props.to }
  }

  if (props.tag === 'a') {
    return { href: props.href }
  }

  // Default button behavior
  return { type: 'button' }
})

const handleClick = (e: Event) => {
  if (props.isBackButton) {
    e.preventDefault()
    const router = useRouter()
    router.back()
  }
}
</script>

<style scoped>
.app-button {
  /* Your existing styles stay exactly as they are */
  display: block;
  padding: 0.5rem 0;
  text-align: center;
  background: var(--color-primary);
  text-decoration: none;
  border-radius: 4px;
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
  width: 100%;
  color: inherit; /* Ensures text color doesn't change when becoming a link */
}

.app-button:hover,
.app-button:focus {
  background: none;
  border-color: var(--color-primary);
}
</style>
