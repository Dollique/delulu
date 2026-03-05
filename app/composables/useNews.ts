// app/composables/useNews.ts
import { ref } from 'vue'

/** Minimal shape of a news article that we care about. */
export interface NewsItem {
  /** Headline displayed in the UI. */
  title: string
  /** URL that points to the full article. */
  link: string
  /** Short excerpt shown underneath the headline. */
  description: string
  /** Image that accompanies the article (may be null/undefined). */
  image_url?: string | null
}

const apiList = [
  {
    api_source: 'NewsData.io',
    api_url: 'https://newsdata.io/api/1/latest',
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
    api_url: 'https://serpapi.com/search',
    proxy_url: '/api/news', // proxy through my own backend request to avoid CORS issues
    api_key: import.meta.env.VITE_API_KEY_SERP,
    authorization_query_parameter: 'api_key',
    query_parameters: {
      engine: 'google_news_light'
    }
  },
  {
    api_source: 'CurrentsAPI',
    api_url: 'https://api.currentsapi.services/v1/latest-news',
    api_key: import.meta.env.VITE_API_KEY_CURRENTS,
    authorization_header: 'Authorization'
  }
]

/** Composable that fetches news from one or more sources. */
export function useNews() {
  const news = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<unknown | null>(null)
  const apiSource = ref<string>('')

  let apiCount = 0

  async function fetchNews(searchquery = '') {
    loading.value = true
    error.value = null

    try {
      const apiConfig = apiList[apiCount]!
      const apiURL = apiConfig.proxy_url ? apiConfig.proxy_url : apiConfig.api_url

      console.log('fetching news from:', apiURL)

      const params = buildQueryParams(apiConfig, searchquery)

      // API Headers
      const headers: Record<string, string> = {}

      if (apiConfig.authorization_header && apiConfig.api_key) {
        headers[apiConfig.authorization_header] = apiConfig.api_key
      }

      /** Fetch the payload from the NewsData.io API. */
      const fullURL = `${apiURL}?${params.toString()}`
      const response = await fetch(fullURL, { headers })

      if (!response.ok) {
        // throw an Error to trigger the fallback logic
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const payload = await response.json()

      // Map the API-specific payload to our standard NewsItem[] format
      news.value = getMapping(payload, apiConfig.api_source)
    } catch (e) {
      console.warn('api did not work', apiList[apiCount])

      // check if there are more api's we haven't tried
      if (apiList[apiCount + 1]) {
        apiCount++
        console.warn('switching to:', apiList[apiCount])
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
    }

    // expose the api key directly as query parameter
    if (apiConfig.authorization_query_parameter) {
      params.set(apiConfig.authorization_query_parameter, apiConfig.api_key ?? '')
    }

    if (apiConfig.query_parameters) {
      // loop  through the query_parameters and add them to the params
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
      // Convert SerpAPI payload (google_news_light) to our NewsItem[]
      return (payload.organic_results ?? []).map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.snippet,
        image_url: item.thumbnail?.image_url ?? null
      })) as NewsItem[]
    } else {
      // Original mapping
      return (payload.results ?? []) as NewsItem[]
    }
  }

  return { news, loading, error, fetchNews, apiSource }
}
