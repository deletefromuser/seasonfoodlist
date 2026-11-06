<template>
  <div class="app">
    <Header :countries="countries" />

    <div class="app-body">
      <FilterPanel :regions="regions" />

      <main class="food-list">
        <div class="results-bar">
          <span class="results-count">{{ t('result.count', { count: filtered.length }) }}</span>
        </div>

        <div v-if="loading" class="empty">{{ t('app.subtitle') }}（加载中……）</div>

        <div v-else-if="filtered.length === 0" class="empty">
          {{ t('result.empty') }}
        </div>

        <div v-else class="food-grid">
          <FoodCard v-for="item in filtered" :key="item.id" :item="item" />
        </div>
      </main>
    </div>

    <footer class="app-footer">
      <div class="footer-line">{{ t('footer.src') }} {{ t('footer.api') }}</div>
      <div class="footer-note">{{ t('footer.demo') }} · {{ t('footer.note') }}</div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { filterStore, t } from './store.js'
import { foodDataService } from './services/foodDataService.js'

import Header from './components/Header.vue'
import FilterPanel from './components/FilterPanel.vue'
import FoodCard from './components/FoodCard.vue'

const countries = ref([])
const regions = ref([])
const foods = ref([])
const loading = ref(false)

const loadCountries = async () => {
  countries.value = await foodDataService.loadCountries()
  if (!filterStore.country && countries.value.length) {
    filterStore.country = countries.value[0].code
  }
}

const loadRegions = async () => {
  regions.value = await foodDataService.loadRegions(filterStore.country)
  filterStore.region = ''
}

const loadFoods = async () => {
  loading.value = true
  try {
    foods.value = await foodDataService.loadFoods(filterStore.country)
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  const f = filterStore
  // 季节快捷月份集合（优先级高于单月）
  const seasonMonths = f._seasonMonths || []
  return foods.value.filter((item) => {
    if (f.region && item.region !== f.region) return false
    // 月份过滤：季节快捷优先，否则用单月
    if (seasonMonths.length > 0) {
      if (!seasonMonths.includes(item.month)) return false
    } else if (f.month && item.month !== f.month) {
      return false
    }
    if (f.category && f.category !== 'all' && item.category !== f.category) return false
    if (f.keyword) {
      const k = f.keyword.toLowerCase()
      const name = (item.name.zh || '') + ' ' + (item.name.en || '')
      return name.toLowerCase().includes(k)
    }
    return true
  })
})

onMounted(async () => {
  await loadCountries()
  await loadRegions()
  await loadFoods()
})

watch(
  () => filterStore.country,
  async (newVal) => {
    if (!newVal) return
    await loadRegions()
    await loadFoods()
  }
)
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  color: #1e293b;
  line-height: 1.5;
}
.app-body {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
}
.filter-panel {
  flex: 0 0 320px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}
.food-list {
  flex: 1;
  min-width: 0;
}
.results-bar {
  margin-bottom: 1rem;
}
.results-count {
  font-size: 0.95rem;
  color: #475569;
}
.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.empty {
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
  color: #64748b;
}
.app-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
}
.footer-line {
  margin-bottom: 0.25rem;
}
.footer-note {
  color: #94a3b8;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .app-body {
    flex-direction: column;
    gap: 0.75rem;
  }
  .filter-panel {
    flex: 0 0 auto;
    width: 100%;
    max-height: none;
  }
  .food-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
