import { sendFetch } from '~/composables/useFetch'

interface ApiConfig {
  api_key: string
  api_key_query_param: string
  // Add other properties if needed
}

interface ApiLists {
  news?: ApiConfig[]
  videos?: ApiConfig[]
}

// Helper to get API key from environment variables
export const getAPIKeyFromEnvironment = (source: string): string => {
  if (import.meta.env.DEV) {
    switch (source) {
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

// Async function to fetch API key from backend or fallback to environment
export const getAPIKey = async (apiKey: string, source: string): Promise<string> => {
  try {
    const response = await sendFetch('/api/getKey', 'POST', { api_key_query_param: source })

    if (response.ok) {
      // 1. Get response as text first to avoid SyntaxError on empty bodies
      const text = await response.text()

      // 2. Check if text actually contains data
      if (text && text.trim().length > 0) {
        try {
          const data = JSON.parse(text)

          // 3. Ensure the parsed data isn't an empty object
          if (data && (typeof data === 'string' || Object.keys(data).length !== 0)) {
            return data
          }
        } catch (parseError) {
          console.warn('Response was not valid JSON:', text)
        }
      }
    }

    // Fallback if response wasn't OK, was empty, or wasn't valid JSON
    return getAPIKeyFromEnvironment(source)
  } catch (error) {
    console.error('Network or system error while fetching API key:', error)
    return getAPIKeyFromEnvironment(source)
  }
}

// Async function which loops through config and looks for all API keys
export const checkForApiKeys = async (apiLists: ApiLists): Promise<boolean> => {
  const allApiConfigs = [...(apiLists.news || []), ...(apiLists.videos || [])]

  for (const apiConfig of allApiConfigs) {
    try {
      const apiKey = await getAPIKey(apiConfig.api_key, apiConfig.api_key_query_param)
      if (apiKey && apiKey.trim() !== '' && apiKey.trim() !== 'YOUR_API_KEY') {
        console.log(`Found API key "${apiConfig.api_key}":`, apiKey)
        return true
      }
    } catch (error) {
      console.error(`Error checking API key for "${apiConfig.api_key}":`, error)
    }
  }

  console.warn('No valid API keys found.')
  return false
}
