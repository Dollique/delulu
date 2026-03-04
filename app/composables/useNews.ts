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

/** Composable that fetches news from one or more sources. */
export function useNews() {
  const news = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<unknown | null>(null)

  async function fetchNews(searchquery = '') {
    loading.value = true
    error.value = null
    try {
      const apiKeyNewsData = import.meta.env.VITE_API_KEY_NEWSDATA || ''

      /** Fetch the payload from the NewsData.io API. */
      const api1 = await fetch(
        `https://newsdata.io/api/1/latest?apikey=${apiKeyNewsData}&language=en&category=entertainment,education,food,science,lifestyle&removeduplicate=1${searchquery ? '&q=' + searchquery : ''}
        `
      ).then((res) => res.json())

      /**
       * The response from NewsData.io has the structure
       *   { status: string, totalResults: number, results: NewsItem[] }
       * So we simply take the `results` array and store it.
       */
      news.value = (api1.results ?? []) as NewsItem[]

      /** Uncomment and adapt the following if you later want to merge
       *  multiple APIs together.
       *
       * const api2 = await fetch('https://api.currentsapi.services/v1/latest-news', {...}).then(res => res.json())
       * news.value = [
       *   ...news.value,
       *   ...normalizeCurrentsAPI(api2) // see below for helper
       * ]
       **/
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { news, loading, error, fetchNews }
}

/** Optional helper that converts other API formats to `NewsItem[]`. */
// function normalizeCurrentsAPI(data: unknown): NewsItem[] {
//   /* Implement mapping for the currents API response when you add it. */
//   return []
// }
