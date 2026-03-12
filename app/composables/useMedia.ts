// app/composables/useMedia.ts
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
import { sendFetch } from '~/composables/useFetch'

export interface MediaItem {
  title: string
  link: string
  description: string
  image_url?: string | null
  source_name?: string | null
  pubDate?: string | null
}

// Set the default request method (can be changed to "GET" if needed)
const REQUEST_METHOD = 'POST' // or 'GET'

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
  const errorMessage = ref<string | null>(null)
  const pagination = usePagination<string>()
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
      const apiKey = await getAPIKey(apiConfig.api_key, apiConfig.api_key_query_param)

      // Build query params (including all query_parameters from apiConfig)
      const params = buildQueryParams(apiConfig, searchquery, pageToken)

      let response

      const headers: Record<string, string> = {}
      if ('authorization_header' in apiConfig && apiConfig.authorization_header && apiKey) {
        headers[apiConfig.authorization_header] = apiKey
      }

      if (apiConfig.proxy_url) {
        // define request headers
        if (apiKey) {
          headers['x-api-key'] = apiKey
        }

        const requestObject = {
          // These are explicitly pulled from apiConfig, NOT the params object
          target_url: apiConfig.api_url,
          api_key_query_param: apiConfig.api_key_query_param,
          authorization_query_parameter: apiConfig.authorization_query_parameter,
          // params now ONLY contains external API fields (q, language, etc.)
          query_params: Object.fromEntries(params.entries())
        }

        response = await sendFetch(apiURL, REQUEST_METHOD, requestObject, headers)
      } else {
        // For direct API calls (no proxy)

        const requestProxyObject = Object.fromEntries(params.entries())

        if (apiKey) {
          requestProxyObject['apikey'] = apiKey
        }

        console.log('REQ object', requestProxyObject)

        response = await sendFetch(apiURL, 'GET', requestProxyObject, headers)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const payload = await response.json()
      media.value = mappingFn(payload, apiConfig.api_source)

      // Handle pagination
      let tokens: { next: string | null; prev: string | null }
      if (mediaType === 'news') {
        tokens =
          apiConfig.api_source === 'NewsData.io'
            ? getPaginationTokensNewsData(payload, apiConfig)
            : getPaginationTokensNews(payload)
      } else {
        tokens = getPaginationTokensVideos(payload)
      }

      pagination.setTokens({ next: tokens.next ?? undefined, prev: tokens.prev ?? undefined })
      pagination.currentPage.value = Math.max(1, paginationHistory.stack.length)
      pagination.hasPrevPage.value = paginationHistory.stack.length > 1
    } catch (e) {
      console.warn('API request failed', apiList[apiCount])

      if (apiList[apiCount + 1]) {
        apiCount++
        console.warn('Switching to:', apiList[apiCount])
        await fetchMedia(searchquery)
      } else {
        console.warn('No more APIs available')
        error.value = e instanceof Error ? e.message : 'Unknown error'
        errorMessage.value = `No valid API Keys found. Check <a href="/setup">setup</a> or instructions.`
      }
    } finally {
      apiSource.value = apiList[apiCount]?.api_source ?? 'unknown'
      loading.value = false
    }
  }

  function buildQueryParams(apiConfig: any, searchquery: string, pageToken?: string) {
    const params = new URLSearchParams()

    // 1. Add base query parameters from config (e.g., category, language)
    if (apiConfig.query_parameters) {
      for (const [key, value] of Object.entries(apiConfig.query_parameters)) {
        params.set(key, String(value))
      }
    }

    // 2. Add the search term
    if (searchquery) {
      const queryKey = apiConfig.query_key || 'q'
      params.set(queryKey, searchquery)
    }

    // 3. Handle Pagination
    if (pageToken && apiConfig.pagination_query_param !== '') {
      addPaginationParams(params, pageToken, apiConfig)
    }

    // 4. Handle Auth for DIRECT calls only (non-proxy)
    if (!apiConfig.proxy_url && apiConfig.authorization_query_parameter) {
      params.set(apiConfig.authorization_query_parameter, apiConfig.api_key ?? '')
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
    paginationHistory.pop()
    const prevToken = paginationHistory.stack[paginationHistory.stack.length - 1]
    await fetchMedia(lastSearchQuery, prevToken ?? undefined)
  }

  async function search(searchquery: string) {
    paginationHistory.reset()
    paginationHistory.push(null)
    await fetchMedia(searchquery)
  }

  return {
    media,
    loading,
    error,
    errorMessage,
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
