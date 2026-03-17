// composables/useMediaNavigation.ts
import { useRoute, useRouter } from 'vue-router'
import { useAppConfig } from '#imports'

export const useMediaNavigation = (mediaType: 'news' | 'videos') => {
  const route = useRoute()
  const router = useRouter()
  const appConfig = useAppConfig()

  // Get the current id from the route, default to 0 if invalid
  const id = computed(() => Number(route.params.id) || 0)

  // Get the API list based on the media type
  const apiList = computed(() => appConfig.apiLists[mediaType])

  // Redirect to id=0 if the current id is out of bounds
  watchEffect(() => {
    if (id.value >= apiList.value.length) {
      router.replace(`/${mediaType}/0`)
    }
  })

  // Handle the "Next Source" button click
  const handleNextSource = () => {
    const nextId = id.value + 1
    if (nextId < apiList.value.length) {
      router.push(`/${mediaType}/${nextId}`)
    } else {
      router.push(`/${mediaType}/0`)
    }
  }

  // Utility function to return a random item from an array
  const returnRandomItem = (searchArray: Array<string>): string => {
    if (!searchArray.length) return ''
    const randomIndex = Math.floor(Math.random() * searchArray.length)
    return searchArray[randomIndex]
  }

  return {
    id,
    apiList,
    handleNextSource,
    returnRandomItem
  }
}
