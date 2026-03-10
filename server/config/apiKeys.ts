/**
 * Mapping of `api_source_key` identifiers to the API key that must be used
 * when that source is requested.
 *
 * Example:
 *   {
 *     'serp_api': process.env.API_KEY_SERP ?? '',
 *     'newsdata': process.env.API_KEY_NEWSDATA ?? ''
 *   }
 */
export const apiKeysBySource: Record<string, string | undefined> = {
  // Map the source name you pass from the query to its key
  serp_api: process.env.VITE_API_KEY_SERP || undefined,
  newsdata: process.env.VITE_API_KEY_NEWSDATA || undefined,
  currents_api: process.env.VITE_API_KEY_CURRENTS || undefined
}
