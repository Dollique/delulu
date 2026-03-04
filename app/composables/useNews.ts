import { ref } from 'vue'

export function useNews(): {
  news: Ref<any[]>
  loading: Ref<boolean>
  error: Ref<unknown | null>
  fetchNews: () => Promise<void>
} {
  const news = ref<any[]>([])
  const loading = ref(false)
  const error = ref<unknown | null>(null)

  async function fetchNews() {
    loading.value = true
    error.value = null
    try {
      // Fetch from multiple APIs and aggregate results
      const [api1] = await Promise.all([
        // list of possible free news APIs:
        // https://github.com/public-apis/public-apis?tab=readme-ov-file#news
        // fetch('https://api1.example.com/news').then((res) => res.json()),
        fetch('https://newsapi.org/v2/everything').then((res) => res.json())
      ])
      news.value = [...(api1 as any[])] // list all apis
    } catch (e) {
      error.value = e as unknown
    } finally {
      loading.value = false
    }
  }

  return { news, loading, error, fetchNews }
}
