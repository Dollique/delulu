// app/composables/useNews.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/** Minimal shape of a news article that we care about. */
export interface NewsItem {
  title: string
  link: string
  description: string
  image_url?: string | null
  source_name?: string | null
  pubDate?: string | null
}

const apiList = [
  {
    api_source: 'NewsData.io',
    api_source_key: 'newsdata',
    api_url: 'https://newsdata.io/api/1/latest',
    proxy_url: '/api/news', // optional proxy
    api_key: import.meta.env.VITE_API_KEY_NEWSDATA,
    authorization_query_parameter: 'apikey',
    query_parameters: {
      language: 'en',
      category: 'entertainment,education,food,science,lifestyle',
      removeduplicate: '1'
    }
  },
  {
    api_source: 'SerpAPI',
    api_source_key: 'serp_api',
    api_url: 'https://serpapi.com/search',
    proxy_url: '/api/news', // SerpAPI doesn't allow CORS, so proxy is mandatory
    api_key: import.meta.env.VITE_API_KEY_SERP,
    authorization_query_parameter: 'api_key',
    query_parameters: {
      engine: 'google_news_light'
    }
  },
  {
    api_source: 'CurrentsAPI',
    api_source_key: 'currents_api',
    api_url: 'https://api.currentsapi.services/v1/latest-news',
    api_key: import.meta.env.VITE_API_KEY_CURRENTS,
    authorization_header: 'Authorization'
  }
]

/** Composable that fetches news from one or more sources. */
export function useNews(apiListIndex: number | null = null) {
  const news = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<unknown | null>(null)
  const apiSource = ref<string>('')
  const router = useRouter()

  let apiCount =
    apiListIndex !== null && apiListIndex >= 0 && apiListIndex < apiList.length ? apiListIndex : 0

  async function fetchNews(searchquery = '') {
    loading.value = true
    error.value = null

    try {
      const apiConfig = apiList[apiCount]!
      const apiURL = apiConfig.proxy_url ? apiConfig.proxy_url : apiConfig.api_url

      console.log('fetching news from:', apiURL)

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
      news.value = getMapping(payload, apiConfig.api_source)
      // Update the route to the current apiCount
      router.push(`/news/${apiCount}`)
    } catch (e) {
      console.warn('api did not work', apiList[apiCount])

      if (apiList[apiCount + 1]) {
        apiCount++
        console.warn('switching to:', apiList[apiCount])
        // Update the route to the new apiCount before retrying
        router.push(`/news/${apiCount}`)
        await fetchNews(searchquery)
      } else {
        console.warn("no more api's available")
        error.value = e
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
        params.set(key, value)
      }
    }

    if (searchquery) {
      params.set('q', searchquery)
    }

    return params
  }

  function getMapping(payload: any, apiSource: string): NewsItem[] {
    if (apiSource === 'SerpAPI') {
      return (payload.news_results ?? []).map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.snippet,
        image_url: item.thumbnail ?? null,
        source_name: item.source ?? null,
        pubDate: item.date ?? null
      })) as NewsItem[]
    } else {
      return (payload.results ?? []) as NewsItem[]
    }
  }

  return { news, loading, error, fetchNews, apiSource }
}
