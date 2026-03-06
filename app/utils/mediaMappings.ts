import type { MediaItem } from '~/composables/useMedia'

export function mapNewsItems(payload: any, apiSource: string): MediaItem[] {
  if (apiSource === 'SerpAPI') {
    return (payload.news_results ?? []).map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.snippet,
      image_url: item.thumbnail ?? null,
      source_name: item.source ?? null,
      pubDate: item.date ?? null
    }))
  } else {
    return payload.results ?? []
  }
}

export function mapVideoItems(payload: any, apiSource: string): MediaItem[] {
  if (apiSource === 'YouTube Data API') {
    return (payload.items ?? []).map((item: any) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      description: item.snippet.description,
      image_url: item.snippet.thumbnails?.high?.url ?? null,
      source_name: item.snippet.channelTitle ?? null,
      pubDate: item.snippet.publishedAt ?? null
    }))
  } else {
    return payload.results ?? []
  }
}
