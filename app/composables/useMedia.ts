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
      const apiKey = getAPIKeyForRequest(apiConfig.api_source_key)

      // Build query params (including all query_parameters from apiConfig)
      const params = buildQueryParams(apiConfig, searchquery, pageToken)

      let response

      if (apiConfig.proxy_url) {
        if (REQUEST_METHOD === 'POST') {
          // For POST proxy requests
          const requestBody = {
            // These are explicitly pulled from apiConfig, NOT the params object
            target_url: apiConfig.api_url,
            api_source_key: apiConfig.api_source_key,
            authorization_query_parameter: apiConfig.authorization_query_parameter,

            // params now ONLY contains external API fields (q, language, etc.)
            query_params: Object.fromEntries(params.entries())
          }

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          }

          response = await fetch(apiURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
          })
        } else {
          // For GET proxy requests, we do need to add the internal keys
          // to the URL so the backend can read them via getQuery(event)
          const proxyParams = new URLSearchParams(params) // Clone the original params
          proxyParams.set('target_url', apiConfig.api_url)
          proxyParams.set('api_source_key', apiConfig.api_source_key)
          proxyParams.set('authorization_query_parameter', apiConfig.authorization_query_parameter)

          const fullURL = `${apiURL}?${proxyParams.toString()}`
          const headers: Record<string, string> = {}

          // Set authorization header if present
          if ('authorization_header' in apiConfig && apiConfig.authorization_header && apiKey) {
            headers[apiConfig.authorization_header] = apiKey
          }

          headers['Content-Type'] = 'application/json'
          headers['x-api-key'] = apiKey

          response = await fetch(fullURL, {
            method: 'GET',
            headers
          })
        }
      } else {
        // For direct API calls
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }

        if (apiConfig.authorization_header && apiKey) {
          headers[apiConfig.authorization_header] = apiKey
        }

        const fullURL = `${apiURL}?${params.toString()}`
        response = await fetch(fullURL, { headers })
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
        errorMessage.value = `No API Keys found. Check <a href="/setup">setup</a> or instructions.`
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
