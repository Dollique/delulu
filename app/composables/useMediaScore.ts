export const useMediaScore = () => {
  const { keyword_scorelist } = useUserPreferences()

  // This function calculates a score based on keywords in the content
  const calculateScore = (item: any): number => {
    if (!item) return 100

    // Get text content for analysis
    const title = item.title?.toLowerCase() || ''
    const description = item.description?.toLowerCase() || ''
    const content = `${title} ${description}`.trim()

    // Use the reactive keyword_scorelist
    const keywordScorelist = keyword_scorelist.value || {}

    // Initialize score at 50 (neutral)
    let score = 50

    // Count keywords and their impact
    let positivePoints = 0
    let negativePoints = 0

    for (const [keyword, weight] of Object.entries(keywordScorelist)) {
      const keywordLower = keyword.toLowerCase()

      // Check if keyword exists in content (including plural forms)
      const hasKeyword = checkKeywordInContent(content, keywordLower)

      if (hasKeyword) {
        if (weight === 0) {
          // Very negative keywords reduce score significantly
          negativePoints += 30
        } else if (weight > 50) {
          // Positive keywords increase score
          positivePoints += weight - 50 // Points above 50
        } else {
          // Keywords with weight between 0 and 50 are treated as negative impact
          negativePoints += weight
        }
      }
    }

    // Adjust score based on keyword counts
    score = Math.max(0, score - negativePoints)
    score = Math.min(100, score + positivePoints)

    return Math.round(score)
  }

  // Helper function to check if keyword exists in content (including plural forms)
  const checkKeywordInContent = (content: string, keyword: string): boolean => {
    // Check exact match
    if (content.includes(keyword)) {
      return true
    }

    // Check for common plural forms
    const pluralForms = [
      keyword + 's', // -s suffix (cat -> cats)
      keyword + 'es', // -es suffix (box -> boxes, bus -> buses)
      keyword.slice(0, -1) + 'ies' // -y -> -ies (baby -> babies)
    ]

    for (const plural of pluralForms) {
      if (content.includes(plural)) {
        return true
      }
    }

    return false
  }

  // This function returns the color grade based on the calculated score
  const getColorGrade = (score: number): string => {
    const config = useAppConfig()
    const { colorGrades } = config.filterOptions

    if (!colorGrades) return '#000000'

    // Find the appropriate color grade
    let color = '#000000' // default black

    // Sort the keys to find the closest match
    const sortedKeys = Object.keys(colorGrades)
      .map(Number)
      .sort((a, b) => a - b)

    // Find the first key that is greater than or equal to score
    for (const key of sortedKeys) {
      if (key >= score) {
        color = colorGrades[key]
        break
      }
    }

    return color
  }

  // This function returns the color grade label based on the calculated score
  const getColorGradeLabel = (score: number): string => {
    const config = useAppConfig()
    const { colorGradeLabels } = config.filterOptions

    if (!colorGradeLabels) return 'Unknown'

    // Sort keys in descending order to find the appropriate label
    const sortedKeys = Object.keys(colorGradeLabels)
      .map(Number)
      .sort((a, b) => b - a)

    for (const key of sortedKeys) {
      if (key <= score) {
        return colorGradeLabels[key]
      }
    }

    return 'Unknown'
  }

  return {
    calculateScore,
    getColorGrade,
    getColorGradeLabel
  }
}
