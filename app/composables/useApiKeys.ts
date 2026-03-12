import { sendFetch } from '~/composables/useFetch'

interface ApiConfig {
  api_key: string
  // Add other properties if needed
}

interface ApiLists {
  news?: ApiConfig[]
  videos?: ApiConfig[]
}

export const getAPIKeyForRequest = (apiKey: string): string => {
  // fetch api keys through backend
  const response = await sendFetch('/api/getKey', 'POST')
  // TODO ???????

  // alternatively get keys from environment variables
  if (import.meta.env.DEV) {
    switch (apiKey) {
      case 'serp_api':
        return import.meta.env.VITE_API_KEY_SERP || ''
      case 'newsdata':
        return import.meta.env.VITE_API_KEY_NEWSDATA || ''
      case 'currents_api':
        return import.meta.env.VITE_API_KEY_CURRENTS || ''
      default:
        return ''
    }
  }
  return ''
}

export const checkForApiKeys = (apiLists: ApiLists): boolean => {
  console.log('Checking for API keys in environment variables and localStorage...', apiLists)

  const allApiConfigs = [...(apiLists.news || []), ...(apiLists.videos || [])]

  for (const apiConfig of allApiConfigs) {
    const apiKey = getAPIKeyForRequest(apiConfig.api_source_key)
    if (apiKey && apiKey.trim() !== '' && apiKey.trim() !== 'YOUR_API_KEY') {
      console.log(`Found API key for source "${apiConfig.api_source_key}":`, apiKey)
      return true
    }
  }

  console.warn('No valid API keys found for any sources.')
  return false
}
