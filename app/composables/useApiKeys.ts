interface ApiConfig {
  api_source_key: string
  // Add other properties if needed
}

interface ApiLists {
  news?: ApiConfig[]
  videos?: ApiConfig[]
}

export const getAPIKeyForRequest = (sourceKey: string): string => {
  // Try to get from localStorage (browser environment)
  if (typeof window !== 'undefined') {
    try {
      const storedKeys = localStorage.getItem('delulu_api_keys')
      if (storedKeys) {
        const parsedKeys = JSON.parse(storedKeys)
        switch (sourceKey) {
          case 'serp_api':
            return parsedKeys.SERP || ''
          case 'newsdata':
            return parsedKeys.NEWSDATA || ''
          case 'currents_api':
            return parsedKeys.CURRENTS || ''
          default:
            return ''
        }
      }
    } catch (e) {
      console.warn('Error parsing stored API keys:', e)
    }
  }

  // Fall back to environment variables (server-side or browser)
  switch (sourceKey) {
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

export const checkForApiKeys = (apiLists: ApiLists): boolean => {
  console.log('Checking for API keys in environment variables and localStorage...', apiLists)

  const allApiConfigs = [...(apiLists.news || []), ...(apiLists.videos || [])]

  for (const apiConfig of allApiConfigs) {
    const apiKey = getAPIKeyForRequest(apiConfig.api_source_key)
    if (apiKey && apiKey.trim() !== '') {
      console.log(`Found API key for source "${apiConfig.api_source_key}":`, apiKey)
      return true
    }
  }

  console.warn('No API keys found for any sources.')
  return false
}
