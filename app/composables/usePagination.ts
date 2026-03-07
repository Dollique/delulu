import { ref } from 'vue'

interface PaginationTokens<T = string | number> {
  next?: T
  prev?: T
}

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
  function setTokens({ next, prev }: PaginationTokens<T>) {
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

/**
 * Extract pagination tokens from SerpAPI news responses.
 */
export function getPaginationTokensNews(payload: any) {
  const nextUrl = payload.serpapi_pagination?.next ?? null
  let nextToken: string | null = null
  if (nextUrl) {
    const urlObj = new URL(nextUrl)
    nextToken = urlObj.searchParams.get('start') ?? null
  }
  return { next: nextToken, prev: null }
}

/**
 * Extract pagination tokens from NewsData.io news responses.
 *
 * NewsData.io returns a simple token like:
 *   nextPage: 1772816400089950750
 */
export function getPaginationTokensNewsData(payload: any, apiConfig: any) {
  return {
    next: payload[apiConfig.pagination_response] ?? null,
    prev: null
  }
}

/**
 * Extract pagination tokens from SerpAPI video responses.
 */
export function getPaginationTokensVideos(payload: any) {
  return {
    next: payload.serpapi_pagination?.next_page_token ?? null,
    prev: payload.serpapi_pagination?.prev_page_token ?? null
  }
}

// --- Pagination query param construction ---

/**
 * Add the pagination query param.
 */
export function addPaginationParams(params: URLSearchParams, token?: string, apiConfig?: any) {
  if (token) params.set(apiConfig.pagination_query_param, token)
}
