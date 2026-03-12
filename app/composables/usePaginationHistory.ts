import { ref } from 'vue'
import { defineStore } from 'pinia'

// Store pagination token history as a stack of tokens (string or null)
export const usePaginationHistory = defineStore('paginationHistory', () => {
  // Stack of tokens (current and previous pages)
  const stack = ref<(string | null)[]>([])

  function push(token: string | null) {
    stack.value.push(token)
  }

  function pop(): string | null | undefined {
    return stack.value.pop()
  }

  function reset() {
    stack.value = []
  }

  function getPrevToken(): string | null | undefined {
    return stack.value.length > 0 ? stack.value[stack.value.length - 1] : undefined
  }

  return { stack, push, pop, reset, getPrevToken }
})
