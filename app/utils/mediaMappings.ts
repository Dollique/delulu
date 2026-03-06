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
  if (apiSource === 'SerpAPI') {
    return (payload.video_results ?? []).map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      image_url: item.thumbnail.static ?? null,
      source_name: 'Youtube - ' + (item.channel.name ?? null),
      pubDate: item.published_date ?? null
    }))
  } else {
    return payload.results ?? []
  }
}
