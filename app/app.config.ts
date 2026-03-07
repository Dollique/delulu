export default defineAppConfig({
  filterOptions: {
    no_ai: true,
    keyword_scorelist: {
      war: 0,
      politics: 20,
      damage: 10,
      drama: 10,
      tragedy: 5,
      toxic: 0,
      violence: 0,
      crime: 5,
      death: 5,
      deadly: 10,
      killed: 0,
      kill: 0,
      disaster: 10,
      accident: 10,
      abuse: 0,
      corruption: 0,
      gambling: 10,
      scandal: 10,
      controversy: 10,
      extremism: 0,
      trump: 30,
      tornado: 30,
      hurricane: 30,
      flood: 30,
      earthquake: 30,
      storm: 30,
      delay: 20,
      cancel: 20,
      cancelled: 20,
      cancellation: 20,
      nature: 100,
      healing: 100,
      achievement: 100,
      innovation: 100,
      discovery: 100,
      art: 100,
      culture: 100,
      education: 100,
      science: 100
    },
    colorGrades: {
      0: '#ff0000', // red for 0%
      25: '#ff7f00', // orange for 25%
      50: '#ffff00', // yellow for 50%
      75: '#7fff00', // light green for 75%
      100: '#00ff00' // green for 100%
    },
    colorGradeLabels: {
      0: 'Very Negative',
      25: 'Negative',
      50: 'Neutral',
      75: 'Positive',
      100: 'Very Positive'
    },
    adult_content: false,
    live_video: false,
    sortByMediaScore: {
      name: 'Sort by Media Score',
      adjustable: true,
      default: true,
      description: 'sorts by most positive score first'
    },
    showColorGradeLabel: {
      name: 'Show Color Grade Label',
      adjustable: true,
      default: true,
      description: 'shows the color grade label in the media card label e.g. "Positive", "Negative"'
    },
    showScoreInLabel: {
      name: 'Show Score in Label',
      adjustable: true,
      default: true,
      description: 'shows the calculated score in the media card label e.g. "Positive (75%)"'
    },
    hideItemsWithScoreLTE: {
      name: 'Hide Items With Score <=',
      adjustable: true,
      default: 10,
      description:
        'items with a score less than or equal to xx will be hidden entirely (display: none)'
    }
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
        pagination_response: 'nextPage',
        pagination_query_param: 'page',
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
        pagination_response: 'serpapi_pagination',
        pagination_query_param: 'start',
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
        pagination_query_param: 'sp',
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
