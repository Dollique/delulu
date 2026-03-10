// server/api/media.ts
// Nuxt API handler for `/api/media`

import { apiKeysBySource } from '../config/apiKeys' // adjust path if needed

// Helper function to throw consistent errors
const throwError = (statusCode: number, statusMessage: string) => {
  throw createError({ statusCode, statusMessage })
}

// Helper function to validate required query parameters
const validateQueryParam = (
  query: Record<string, string | undefined>,
  paramName: string,
  errorMessage: string
) => {
  if (!query[paramName]) {
    throwError(400, errorMessage)
  }
}

const getApiKeyFromHeaders = (event: any, sourceKey?: string) => {
  // 1. Try to get from Headers first (Nuxt 3 style)
  const headers = getHeaders(event)
  let apiKey = headers['x-api-key']

  // 2. Fallback: If no header, check environment variables based on the sourceKey
  if (!apiKey && sourceKey) {
    switch (sourceKey) {
      case 'serp_api':
        apiKey = process.env.VITE_API_KEY_SERP
        break
      case 'newsdata':
        apiKey = process.env.VITE_API_KEY_NEWSDATA
        break
      case 'currents_api':
        apiKey = process.env.VITE_API_KEY_CURRENTS
        break
    }
  }

  return apiKey // Critical: Must return the value!
}

export default defineEventHandler(async (event) => {
  if (event.req.method === 'POST') {
    const body = await readBody(event)

    // Validate required fields
    if (!body.target_url) throwError(400, 'Missing required field `target_url`')
    if (!body.api_source_key) throwError(400, 'Missing required field `api_source_key`')
    if (!body.authorization_query_parameter)
      throwError(400, 'Missing required field `authorization_query_parameter`')

    const apiKey =
      getApiKeyFromHeaders(event, body.api_source_key) ?? apiKeysBySource[body.api_source_key]

    if (!apiKey) {
      throwError(400, `No API key configured for source "${body.api_source_key}"`)
    }

    // Build the target URL with query parameters
    const url = new URL(body.target_url)
    if (body.query_params) {
      Object.entries(body.query_params).forEach(([key, value]) => {
        url.searchParams.append(key, value as string)
      })
    }

    // Add API key as a query parameter to the target URL
    if (apiKey && body.authorization_query_parameter) {
      url.searchParams.append(body.authorization_query_parameter, apiKey)
    }

    // Make the actual API request
    const response = await fetch(url.toString())
    if (!response.ok) {
      const text = await response.text()
      throwError(response.status, text || response.statusText)
    }
    return await response.json()
  }
  // Handle GET requests (using your previous working logic)
  else if (event.req.method === 'GET') {
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
    const sourceKey = query.api_source_key as string
    const apiKey = getApiKeyFromHeaders(event, sourceKey) ?? apiKeysBySource[sourceKey]

    if (!apiKey) {
      throwError(400, `No API key configured for source "${sourceKey}"`)
    }

    const authorizationKey = query.authorization_query_parameter

    // Build the full target URL, excluding internal params
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
  } else {
    throwError(405, 'Method not allowed')
  }
})
