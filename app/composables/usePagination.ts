// app/composables/usePagination.ts
import { ref } from 'vue'

/**
 * Generic composable for pagination state and logic.
 * Designed to be extended for API-specific pagination mechanisms.
 */
export function usePagination<T = string | number>() {
  // Token or page number for next page
  const nextPageToken = ref<T | null>(null)
  // Token or page number for previous page (optional)
  const prevPageToken = ref<T | null>(null)
  // Current page index (optional, for page-based APIs)
  const currentPage = ref<number>(1)
  // Is there a next page?
  const hasNextPage = ref<boolean>(false)
  // Is there a previous page?
  const hasPrevPage = ref<boolean>(false)

  // Set tokens for SerpAPI or other APIs
  function setTokens({ next, prev }: { next?: T; prev?: T }) {
    nextPageToken.value = next ?? null
    prevPageToken.value = prev ?? null
    hasNextPage.value = !!next
    hasPrevPage.value = !!prev
  }

  // Reset pagination state
  function reset() {
    nextPageToken.value = null
    prevPageToken.value = null
    currentPage.value = 1
    hasNextPage.value = false
    hasPrevPage.value = false
  }

  return {
    nextPageToken,
    prevPageToken,
    currentPage,
    hasNextPage,
    hasPrevPage,
    setTokens,
    reset
  }
}

// --- Pagination token extraction ---
export function getPaginationTokensNews(payload: any) {
  const nextUrl = payload.serpapi_pagination?.next ?? null
  let nextToken: string | null = null
  if (nextUrl) {
    const urlObj = new URL(nextUrl)
    nextToken = urlObj.searchParams.get('start') ?? null
  }
  return { next: nextToken, prev: null }
}

export function getPaginationTokensVideos(payload: any) {
  return {
    next: payload.serpapi_pagination?.next_page_token ?? null,
    prev: payload.serpapi_pagination?.prev_page_token ?? null
  }
}

// --- Pagination param addition ---
export function addPaginationParamsNews(params: URLSearchParams, token?: string) {
  if (token) params.set('start', token)
}

export function addPaginationParamsVideos(params: URLSearchParams, token?: string) {
  if (token) params.set('sp', token)
}
