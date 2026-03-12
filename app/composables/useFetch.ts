export const sendFetch = async (
  apiURL: string,
  fetchMethod = 'POST',
  requestObject = {},
  requestHeaders = {}
) => {
  let fullURL = apiURL
  if (fetchMethod === 'GET') {
    // 1. Flatten the nested object
    const flatObject = flattenObject(requestObject)

    // 2. Now URLSearchParams can handle it
    const queryParams = new URLSearchParams(flatObject)
    fullURL = `${apiURL}?${queryParams.toString()}`
  }

  let headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (requestHeaders) {
    headers = {
      ...headers,
      ...requestHeaders // add additional headers
    }
  }

  return await fetch(fetchMethod === 'GET' ? fullURL : apiURL, {
    method: fetchMethod,
    headers,
    body: fetchMethod === 'POST' ? JSON.stringify(requestObject) : undefined
  })
}

// Helper to flatten nested objects for URL params
const flattenObject = (obj: any, result: Record<string, string> = {}): Record<string, string> => {
  Object.keys(obj).forEach((k) => {
    const value = obj[k]

    if (value === null || value === undefined) {
      return
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        // Handle arrays: flatten with indices
        value.forEach((item, i) => {
          if (typeof item === 'object' && item !== null) {
            flattenObject(item, result)
          } else {
            result[`${k}[${i}]`] = String(item)
          }
        })
      } else {
        // Handle nested objects: flatten directly to root
        flattenObject(value, result)
      }
    } else {
      // Add non-object values directly to the result
      result[k] = String(value)
    }
  })
  return result
}
