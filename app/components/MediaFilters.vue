<template>
  <div class="media-filters" v-if="showFilters">
    <div class="filters-header">
      <h2>Media Filters</h2>
      <button @click="closeFilters" class="close-button" aria-label="Close filters">&times;</button>
    </div>

    <div class="filter-content">
      <div class="filter-section">
        <h3>Sorting & Display</h3>

        <div class="filter-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="localPreferences.sortByMediaScore"
              :aria-labelledby="'sortByMediaScore-label'"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text" id="sortByMediaScore-label">
              {{ getPreferenceName('sortByMediaScore') }}
            </span>
          </label>
          <p class="description">{{ getPreferenceDescription('sortByMediaScore') }}</p>
        </div>

        <div class="filter-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="localPreferences.showColorGradeLabel"
              :aria-labelledby="'showColorGradeLabel-label'"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text" id="showColorGradeLabel-label">
              {{ getPreferenceName('showColorGradeLabel') }}
            </span>
          </label>
          <p class="description">{{ getPreferenceDescription('showColorGradeLabel') }}</p>
        </div>

        <div class="filter-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="localPreferences.showScoreInLabel"
              :aria-labelledby="'showScoreInLabel-label'"
            />
            <span class="checkbox-custom"></span>
            <span class="label-text" id="showScoreInLabel-label">
              {{ getPreferenceName('showScoreInLabel') }}
            </span>
          </label>
          <p class="description">{{ getPreferenceDescription('showScoreInLabel') }}</p>
        </div>

        <div class="filter-item">
          <label class="range-label" :for="'hideItemsWithScoreLTE-range'">
            {{ getPreferenceName('hideItemsWithScoreLTE') }}
          </label>
          <div class="range-container">
            <input
              type="range"
              v-model.number="localPreferences.hideItemsWithScoreLTE"
              min="0"
              max="100"
              step="5"
              class="range-input"
              :id="'hideItemsWithScoreLTE-range'"
            />
            <span class="value-display">{{ localPreferences.hideItemsWithScoreLTE }}</span>
          </div>
          <p class="description">{{ getPreferenceDescription('hideItemsWithScoreLTE') }}</p>
        </div>
      </div>

      <div class="filter-section">
        <h3>Keyword Scores</h3>

        <div class="filter-warning">
          <p>Attention: All changes are temporary and will be overwritten on the next reload</p>
        </div>

        <h4 class="filter-subsection-title">Add New Keyword</h4>
        <div class="add-keyword-form">
          <input v-model="newKeyword" placeholder="New keyword" class="new-keyword-input" />
          <input
            v-model.number="newKeywordScore"
            type="number"
            placeholder="Score"
            min="-100"
            max="200"
            class="new-keyword-score-input"
          />
          <button @click="addNewKeyword" class="add-keyword-button">Add</button>
        </div>

        <h4 class="filter-subsection-title">Change Keyword Scores</h4>
        <div class="keyword-scores">
          <div
            v-for="(score, keyword) in localPreferences.keyword_scorelist"
            :key="keyword"
            class="keyword-score-item"
          >
            <label class="keyword-label" :for="'score-' + keyword"> {{ keyword }}: </label>
            <input
              type="number"
              v-model.number="localPreferences.keyword_scorelist[keyword]"
              min="-100"
              max="200"
              class="score-input"
              :id="'score-' + keyword"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="filter-actions">
      <button @click="resetToDefaults" class="reset-button">Reset to Defaults</button>
      <button @click="saveAndClose" class="save-button">Save Preferences</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserPreferences } from '@/composables/useUserPreferences'

const props = defineProps<{
  showFilters: boolean
}>()

const emit = defineEmits(['close-filters'])

const {
  sortByMediaScore,
  showColorGradeLabel,
  showScoreInLabel,
  hideItemsWithScoreLTE,
  keyword_scorelist,
  updatePreference,
  resetToDefaults: resetToDefaultsFn
} = useUserPreferences()

const localPreferences = ref({
  sortByMediaScore: sortByMediaScore.value,
  showColorGradeLabel: showColorGradeLabel.value,
  showScoreInLabel: showScoreInLabel.value,
  hideItemsWithScoreLTE: hideItemsWithScoreLTE.value,
  keyword_scorelist: { ...keyword_scorelist.value }
})

const newKeyword = ref('')
const newKeywordScore = ref(0)

const addNewKeyword = () => {
  if (!newKeyword.value.trim()) return
  if (localPreferences.value.keyword_scorelist[newKeyword.value.trim()]) {
    alert('Keyword already exists!')
    return
  }
  const key = newKeyword.value.trim()
  const score = newKeywordScore.value
  localPreferences.value.keyword_scorelist[key] = score
  newKeyword.value = ''
  newKeywordScore.value = 0
}

watch(
  [
    sortByMediaScore,
    showColorGradeLabel,
    showScoreInLabel,
    hideItemsWithScoreLTE,
    keyword_scorelist
  ],
  ([
    newSortByMediaScore,
    newShowColorGradeLabel,
    newShowScoreInLabel,
    newHideItemsWithScoreLTE,
    newKeywordScorelist
  ]) => {
    localPreferences.value = {
      sortByMediaScore: newSortByMediaScore,
      showColorGradeLabel: newShowColorGradeLabel,
      showScoreInLabel: newShowScoreInLabel,
      hideItemsWithScoreLTE: newHideItemsWithScoreLTE,
      keyword_scorelist: { ...newKeywordScorelist }
    }
  },
  { deep: true }
)

const closeFilters = () => {
  emit('close-filters')
}

const getPreferenceName = (key: string) => {
  const config = useAppConfig()
  const option = config.filterOptions[key]
  return typeof option === 'object' && option !== null && option.name ? option.name : key
}

const getPreferenceDescription = (key: string) => {
  const config = useAppConfig()
  const option = config.filterOptions[key]
  return typeof option === 'object' && option !== null && option.description
    ? option.description
    : ''
}

const resetToDefaults = () => {
  resetToDefaultsFn()
  localPreferences.value = {
    sortByMediaScore: sortByMediaScore.value,
    showColorGradeLabel: showColorGradeLabel.value,
    showScoreInLabel: showScoreInLabel.value,
    hideItemsWithScoreLTE: hideItemsWithScoreLTE.value,
    keyword_scorelist: { ...keyword_scorelist.value }
  }
}

const saveAndClose = () => {
  updatePreference('sortByMediaScore', localPreferences.value.sortByMediaScore)
  updatePreference('showColorGradeLabel', localPreferences.value.showColorGradeLabel)
  updatePreference('showScoreInLabel', localPreferences.value.showScoreInLabel)
  updatePreference('hideItemsWithScoreLTE', localPreferences.value.hideItemsWithScoreLTE)
  updatePreference('keyword_scorelist', { ...localPreferences.value.keyword_scorelist })
  emit('close-filters')
}
</script>

<style scoped>
.media-filters {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-secondary);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
}

.media-filters h1,
.media-filters h2,
.media-filters h3,
.media-filters h4 {
  color: var(--color-gray);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-gray);
  padding: 4px;
}

.filter-content {
  max-width: 800px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 32px;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  padding: 16px;
}

.filter-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
}

.filter-warning {
  background-color: #fff3cd;
  border: 2px dashed var(--color-primary);
  color: #856404;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.filter-item {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 6px;
}

.checkbox-custom {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 1px solid var(--color-gray);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input[type='checkbox'] {
  display: none;
}

.checkbox-label input[type='checkbox']:checked + .checkbox-custom {
  background: var(--color-positive);
  border-color: var(--color-positive);
}

.checkbox-label input[type='checkbox']:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.label-text {
  font-weight: 500;
  color: var(--color-gray);
}

.description {
  font-size: 0.85em;
  color: #666;
  margin: 0;
  padding-left: 24px;
}

.range-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-gray);
}

.range-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-input {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-positive);
  border-radius: 50%;
  cursor: pointer;
}

.value-display {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  color: var(--color-gray);
}

.keyword-scores {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.keyword-score-item {
  display: flex;
  flex-direction: column;
}

.keyword-label {
  font-size: 0.85em;
  margin-bottom: 4px;
  font-weight: 500;
  color: var(--color-gray);
}

.score-input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  color: var(--color-gray);
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #ccc;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.reset-button,
.save-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.reset-button {
  background-color: #f5f5f5;
  color: var(--color-gray);
}

.reset-button:hover {
  background-color: #e0e0e0;
}

.save-button {
  background-color: var(--color-positive);
  color: #fff;
}

.save-button:hover {
  background-color: #45a049;
}

.add-keyword-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.new-keyword-input,
.new-keyword-score-input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.add-keyword-button {
  padding: 6px 12px;
  background: var(--color-positive);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
