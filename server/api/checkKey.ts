// server/api/check-key.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const apiKey = query.api_key as string

  // Map the api key to your environment variable names
  const envKeyMap: Record<string, string> = {
    serp_api: 'VITE_API_KEY_SERP',
    newsdata: 'VITE_API_KEY_NEWSDATA',
    currents_api: 'VITE_API_KEY_CURRENTS'
  }

  // Check if the corresponding environment variable is set
  const envKey = envKeyMap[apiKey]
  const hasKey = envKey ? !!process.env[envKey] : false

  return { hasKey }
})
