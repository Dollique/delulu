import { computed } from 'vue'

export const useUserPreferences = () => {
  // Get the default config
  const defaultConfig = useAppConfig()

  // Helper function to extract value from preference config
  const getPreferenceValue = (preference: any) => {
    if (typeof preference === 'object' && preference !== null) {
      // If it's a config object with default property, return the default
      if (preference.default !== undefined) {
        return preference.default
      }
      // If it's just an object value, return it as is
      return preference
    }
    // If it's a primitive value, return it directly
    return preference
  }

  // Create reactive state for user preferences using useState
  const userPreferences = useState('userMediaPreferences', () => ({
    sortByMediaScore: getPreferenceValue(defaultConfig.filterOptions.sortByMediaScore),
    showColorGradeLabel: getPreferenceValue(defaultConfig.filterOptions.showColorGradeLabel),
    showScoreInLabel: getPreferenceValue(defaultConfig.filterOptions.showScoreInLabel),
    hideItemsWithScoreLTE: getPreferenceValue(defaultConfig.filterOptions.hideItemsWithScoreLTE),
    keyword_scorelist: { ...defaultConfig.filterOptions.keyword_scorelist }
  }))

  // Computed properties to get current values with fallback to defaults
  const sortByMediaScore = computed(() => userPreferences.value.sortByMediaScore)
  const showColorGradeLabel = computed(() => userPreferences.value.showColorGradeLabel)
  const showScoreInLabel = computed(() => userPreferences.value.showScoreInLabel)
  const hideItemsWithScoreLTE = computed(() => userPreferences.value.hideItemsWithScoreLTE)
  const keyword_scorelist = computed(() => userPreferences.value.keyword_scorelist)

  // Function to update a preference
  const updatePreference = (key: string, value: any) => {
    userPreferences.value[key] = value
  }

  // Function to reset to defaults
  const resetToDefaults = () => {
    userPreferences.value = {
      sortByMediaScore: getPreferenceValue(defaultConfig.filterOptions.sortByMediaScore),
      showColorGradeLabel: getPreferenceValue(defaultConfig.filterOptions.showColorGradeLabel),
      showScoreInLabel: getPreferenceValue(defaultConfig.filterOptions.showScoreInLabel),
      hideItemsWithScoreLTE: getPreferenceValue(defaultConfig.filterOptions.hideItemsWithScoreLTE),
      keyword_scorelist: { ...defaultConfig.filterOptions.keyword_scorelist }
    }
  }

  return {
    sortByMediaScore,
    showColorGradeLabel,
    showScoreInLabel,
    hideItemsWithScoreLTE,
    keyword_scorelist,
    updatePreference,
    resetToDefaults
  }
}
