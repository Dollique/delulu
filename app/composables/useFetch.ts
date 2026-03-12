export const sendFetch = async (
  apiURL: string,
  fetchMethod = 'POST',
  requestBody,
  requestHeaders
) => {
  let fullURL = apiURL
  if (fetchMethod === 'GET') {
    // requestBody = url params for GET request
    fullURL = `${apiURL}?${requestBody.toString()}`
  }

  let headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (requestHeaders) {
    headers = {
      ...requestHeaders // add additional headers
    }
  }

  return await fetch(fetchMethod === 'GET' ? fullURL : apiURL, {
    method: fetchMethod,
    headers,
    body: JSON.stringify(requestBody)
  })
}
