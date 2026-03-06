// composables/useMedia.ts
import { ref } from 'vue'
import { useAppConfig } from '#imports'

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

  let apiCount = id !== null && id >= 0 && id < apiList.length ? id : 0

  async function fetchMedia(searchquery = '') {
    loading.value = true
    error.value = null

    try {
      const apiConfig = apiList[apiCount]!
      const apiURL = apiConfig.proxy_url ? apiConfig.proxy_url : apiConfig.api_url

      console.log(`fetching ${mediaType} from:`, apiURL)

      const params = buildQueryParams(apiConfig, searchquery)

      const headers: Record<string, string> = {}

      if (apiConfig.authorization_header && apiConfig.api_key) {
        headers[apiConfig.authorization_header] = apiConfig.api_key
      }

      const fullURL = `${apiURL}?${params.toString()}`
      const response = await fetch(fullURL, { headers })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const payload = await response.json()
      media.value = mappingFn(payload, apiConfig.api_source)
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

  function buildQueryParams(apiConfig: any, searchquery: string) {
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

    return params
  }

  return { media, loading, error, fetchMedia, apiSource, apiCount }
}
