interface ApiConfig {
  api_key: string
  // Add other properties if needed
}

interface ApiLists {
  news?: ApiConfig[]
  videos?: ApiConfig[]
}

export const getAPIKeyForRequest = (apiKey: string): string => {
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

// utils/api.ts
export const checkForApiKeys = async (apiLists: ApiLists): Promise<boolean> => {
  console.log('Checking for API keys...', apiLists)
  const allApiConfigs = [...(apiLists.news || []), ...(apiLists.videos || [])]

  for (const apiConfig of allApiConfigs) {
    let hasKey = false

    // Always try the backend first (even in development)
    try {
      // Use api_key to identify which key to check

      // TODO:
      // USE POST
      // USE X-API-KEY HEADER

      //const response = await fetch(`/api/check-key?api_key=${apiConfig.api_key}`)
      //const result = await response.json()
      hasKey = result.hasKey
      if (hasKey) {
        console.log(`API key found for "${apiConfig.api_key}" (backend check)`)
        return true
      }
    } catch (e) {
      console.warn(`Backend check failed for ${apiConfig.api_key}, falling back to .env:`, e)
      // Fall back to .env only if the backend check fails and we're in development
      if (import.meta.env.DEV) {
        const apiKey = getAPIKeyForRequest(apiConfig.api_key)
        hasKey = !!apiKey && !apiKey.includes('YOUR_API_KEY')
        if (hasKey) {
          console.log(`API key found for "${apiConfig.api_key}" (.env fallback)`)
          return true
        }
      }
    }
  }

  console.warn('No valid API keys found for any APIs.')
  return false
}
