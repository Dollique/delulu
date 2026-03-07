import { ref } from 'vue'
import { useAppConfig } from '#imports'
import {
  usePagination,
  getPaginationTokensNews,
  getPaginationTokensVideos,
  addPaginationParams,
  getPaginationTokensNewsData
} from './usePagination'
import { usePaginationHistory } from './usePaginationHistory'

/** Minimal shape of a media item that we care about. */
export interface MediaItem {
  title: string
  link: string
  description: string
  image_url?: string | null
  source_name?: string | null
  pubDate?: string | null
}

/** Composable that fetches media from one or more sources. */
export function useMedia(
  mediaType: 'news' | 'videos',
  id: number,
  mappingFn: (payload: any, apiSource: string) => MediaItem[]
) {
  const loading = ref(false)
  const appConfig = useAppConfig()
  const apiList = appConfig.apiLists[mediaType]
  const apiSource = ref(apiList[id]?.api_source || '')
  const media = ref<MediaItem[]>([])
  const error = ref<string | null>(null)
  const pagination = usePagination<string>() // Use string for SerpAPI tokens
  const paginationHistory = usePaginationHistory()
  let lastSearchQuery = ''

  let apiCount = id !== null && id >= 0 && id < apiList.length ? id : 0

  async function fetchMedia(searchquery = '', pageToken?: string) {
    loading.value = true
    error.value = null
    if (searchquery) {
      lastSearchQuery = searchquery
    }

    try {
      const apiConfig = apiList[apiCount]!
      const apiURL = apiConfig.proxy_url ? apiConfig.proxy_url : apiConfig.api_url

      const params = buildQueryParams(apiConfig, searchquery, pageToken)
      const headers: Record<string, string> = {}

      // Set authorization header if present
      if (
        'authorization_header' in apiConfig &&
        apiConfig.authorization_header &&
        apiConfig.api_key
      ) {
        headers[apiConfig.authorization_header] = apiConfig.api_key
      }

      const fullURL = `${apiURL}?${params.toString()}`
      const response = await fetch(fullURL, { headers })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const payload = await response.json()
      media.value = mappingFn(payload, apiConfig.api_source)

      // Determine pagination tokens based on API type
      let tokens: { next: string | null; prev: string | null }
      if (mediaType === 'news') {
        // Check if this is NewsData.io API
        if (apiConfig.api_source === 'NewsData.io') {
          tokens = getPaginationTokensNewsData(payload, apiConfig)
        } else {
          tokens = getPaginationTokensNews(payload)
        }
      } else {
        tokens = getPaginationTokensVideos(payload)
      }
      pagination.setTokens({ next: tokens.next ?? undefined, prev: tokens.prev ?? undefined })
      // UI state: always reflect history stack (stack.length = current page number, min 1)
      pagination.currentPage.value = Math.max(1, paginationHistory.stack.length)
      pagination.hasPrevPage.value = paginationHistory.stack.length > 1
    } catch (e) {
      console.warn('api did not work', apiList[apiCount])

      if (apiList[apiCount + 1]) {
        apiCount++
        console.warn('switching to:', apiList[apiCount])
        await fetchMedia(searchquery) // Retry with the next API
      } else {
        console.warn("no more api's available")
        error.value = e instanceof Error ? e.message : 'Unknown error'
      }
    } finally {
      apiSource.value = apiList[apiCount]?.api_source ?? 'unknown'
      loading.value = false
    }
  }

  function buildQueryParams(apiConfig: any, searchquery: string, pageToken?: string) {
    const params = new URLSearchParams()

    if (apiConfig.proxy_url) {
      params.set('target_url', apiConfig.api_url)
      params.set('api_source_key', apiConfig.api_source_key)
    }

    if (apiConfig.authorization_query_parameter) {
      if (!apiConfig.proxy_url) {
        params.set(apiConfig.authorization_query_parameter, apiConfig.api_key ?? '')
      } else {
        params.set('authorization_query_parameter', apiConfig.authorization_query_parameter)
      }
    }

    if (apiConfig.query_parameters) {
      for (const [key, value] of Object.entries(apiConfig.query_parameters)) {
        params.set(key, String(value))
      }
    }

    if (searchquery) {
      const queryKey = apiConfig.query_key || 'q'
      params.set(queryKey, searchquery)
    }

    // Add pagination token if present
    if (pageToken && apiConfig.pagination_query_param !== '') {
      addPaginationParams(params, pageToken, apiConfig)
    } else {
      console.debug('No pagination query param defined for this news API, skipping token addition.')
    }

    return params
  }

  async function fetchNextPage() {
    if (pagination.nextPageToken.value) {
      paginationHistory.push(pagination.nextPageToken.value)
      await fetchMedia(lastSearchQuery, pagination.nextPageToken.value)
    }
  }

  function handleNextPage() {
    fetchNextPage()
  }

  async function handlePrevPage() {
    paginationHistory.pop() // Remove current page token
    const prevToken = paginationHistory.stack[paginationHistory.stack.length - 1] // Peek previous
    await fetchMedia(lastSearchQuery, prevToken ?? undefined)
  }

  // Call this on initial search to reset the stack
  async function search(searchquery: string) {
    paginationHistory.reset()
    paginationHistory.push(null) // null = first page (no token)
    await fetchMedia(searchquery)
  }

  return {
    media,
    loading,
    error,
    fetchMedia,
    search,
    apiSource,
    apiCount,
    pagination,
    fetchNextPage,
    handleNextPage,
    handlePrevPage
  }
}
