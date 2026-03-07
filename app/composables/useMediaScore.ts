import { ref } from 'vue'

export const useMediaScore = () => {
  // This function calculates a score based on keywords in the content
  const calculateScore = (item: any): number => {
    if (!item) return 100

    // Get text content for analysis
    const title = item.title?.toLowerCase() || ''
    const description = item.description?.toLowerCase() || ''
    const content = `${title} ${description}`.trim()

    // Get the configuration from app.config.ts
    const config = useAppConfig()
    const keywordScorelist = config.filterOptions.keyword_scorelist || {}

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

    // Check for plural form (simple s suffix)
    if (keyword.endsWith('s') && content.includes(keyword.slice(0, -1))) {
      return true
    }

    // Check for plural form (adding s suffix)
    if (!keyword.endsWith('s') && content.includes(keyword + 's')) {
      return true
    }

    // Check for common plural forms
    const pluralForms = [
      keyword + 'es', // -es suffix (happiness -> happiness, bus -> buses)
      keyword.slice(0, -1) + 'ies', // -ies suffix (city -> cities)
      keyword.slice(0, -2) + 'ies' // -y -> -ies (baby -> babies)
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
    const { colorGrades, colorGradeLabels } = config.filterOptions

    if (!colorGrades || !colorGradeLabels) return '#000000'

    // Find the appropriate color grade
    let color = '#000000' // default black

    // Sort the keys to find the closest match
    const sortedKeys = Object.keys(colorGrades)
      .map(Number)
      .sort((a, b) => a - b)

    // Find the first key that is >= score
    for (const key of sortedKeys) {
      if (key >= score) {
        color = colorGrades[key]
        break
      }
    }

    // If no match found, use the last color (highest score)
    if (color === '#000000' && sortedKeys.length > 0) {
      color = colorGrades[sortedKeys[sortedKeys.length - 1]]
    }

    return color
  }

  // This function returns the label based on the calculated score
  const getColorGradeLabel = (score: number): string => {
    const config = useAppConfig()
    const { colorGradeLabels } = config.filterOptions

    if (!colorGradeLabels) return 'Unknown'

    // Find the appropriate label
    let label = 'Unknown'

    // Sort the keys to find the closest match
    const sortedKeys = Object.keys(colorGradeLabels)
      .map(Number)
      .sort((a, b) => a - b)

    // Find the first key that is >= score
    for (const key of sortedKeys) {
      if (key >= score) {
        label = colorGradeLabels[key]
        break
      }
    }

    // If no match found, use the last label (highest score)
    if (label === 'Unknown' && sortedKeys.length > 0) {
      label = colorGradeLabels[sortedKeys[sortedKeys.length - 1]]
    }

    return label
  }

  return {
    calculateScore,
    getColorGrade,
    getColorGradeLabel
  }
}
