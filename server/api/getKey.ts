export default defineEventHandler(async (event) => {
  const xApiKey = event.req.headers['x-api-key']

  if (!xApiKey) {
    return '' // no x-api-key header found, return empty string
  }

  return { xApiKey }
})
