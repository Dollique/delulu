export default defineAppConfig({
  filterOptions: {
    no_ai: true,
    keyword_blocklist: ['war', 'politics', 'damage', 'drama', 'tragedy'],
    keyword_yeslist: ['nature', 'healing', 'achievement'],
    adult_content: false,
    live_video: false
  },
  apiLists: {
    news: [
      {
        api_source: 'NewsData.io',
        api_source_key: 'newsdata',
        api_url: 'https://newsdata.io/api/1/latest',
        proxy_url: '/api/media',
        api_key: process.env.VITE_API_KEY_NEWSDATA,
        authorization_query_parameter: 'apikey',
        query_parameters: {
          language: 'en',
          category: 'entertainment,education,food,science,lifestyle',
          removeduplicate: '1'
        }
      },
      {
        api_source: 'SerpAPI',
        api_source_key: 'serp_api',
        api_url: 'https://serpapi.com/search',
        proxy_url: '/api/media',
        api_key: process.env.VITE_API_KEY_SERP,
        authorization_query_parameter: 'api_key',
        query_parameters: {
          engine: 'google_news_light'
        }
      },
      {
        api_source: 'CurrentsAPI',
        api_source_key: 'currents_api',
        api_url: 'https://api.currentsapi.services/v1/latest-news',
        api_key: process.env.VITE_API_KEY_CURRENTS,
        authorization_header: 'Authorization'
      }
    ],
    videos: [
      {
        api_source: 'SerpAPI',
        api_source_key: 'serp_api',
        api_url: 'https://serpapi.com/search',
        proxy_url: '/api/media',
        api_key: process.env.VITE_API_KEY_SERP,
        authorization_query_parameter: 'api_key',
        query_key: 'search_query',
        query_parameters: {
          engine: 'youtube'
        }
      }
      /*{
        api_source: 'YouTube Data API',
        api_source_key: 'youtube',
        api_url: 'https://www.googleapis.com/youtube/v3/search',
        proxy_url: '/api/media',
        api_key: process.env.VITE_API_KEY_YOUTUBE,
        authorization_query_parameter: 'key',
        query_parameters: {
          part: 'snippet',
          type: 'video',
          maxResults: 10
        }
      }*/
    ]
  }
})
