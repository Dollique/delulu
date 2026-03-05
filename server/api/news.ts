// Nuxt API handler for `/api/news`

import { apiKeysBySource } from '../config/apiKeys' // adjust path if needed

// Helper function to throw consistent errors
const throwError = (statusCode, statusMessage) => {
  throw createError({ statusCode, statusMessage })
}

// Helper function to validate required query parameters
const validateQueryParam = (query, paramName, errorMessage) => {
  if (!query[paramName]) {
    throwError(400, errorMessage)
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, string | undefined>

  // Validate required query parameters
  validateQueryParam(query, 'target_url', 'Missing required query param `target_url`')
  validateQueryParam(query, 'api_source_key', 'Missing required query param `api_source_key`')
  validateQueryParam(
    query,
    'authorization_query_parameter',
    'Missing required query param `authorization_query_parameter`'
  )

  // Validate API key for the source
  const apiKey = apiKeysBySource[query.api_source_key!]
  if (!apiKey) {
    throwError(400, `No API key configured for source "${query.api_source_key}"`)
  }

  const authorizationKey = query.authorization_query_parameter

  // Build the full target URL, excluding `authorization_query_parameter` and other internal params
  const params = new URLSearchParams(
    Object.entries(query).filter(
      ([k]) => !['target_url', 'api_source_key', 'authorization_query_parameter'].includes(k)
    )
  )

  // Add the API key to the query params using the authorization key
  params.set(authorizationKey, apiKey)

  const fullUrl = `${query.target_url}?${params.toString()}`

  // Call the external API
  const res = await fetch(fullUrl)

  // Forward errors transparently
  if (!res.ok) {
    const text = await res.text()
    throwError(res.status, text || res.statusText)
  }

  // Return the JSON payload
  return res.json()
})
