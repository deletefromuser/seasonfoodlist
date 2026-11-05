<template>
  <aside class="filter-panel">
    <div class="panel-title">{{ t('nav.country') }} / {{ t('nav.province') }} / {{ t('nav.city') }}</div>

    <div class="filter-group">
      <label class="filter-label">{{ t('nav.province') }}</label>
      <select v-model="filterStore.province" class="filter-select">
        <option value="">{{ t('btn.all') }}</option>
        <option
          v-for="r in provinceOptions"
          :key="r.code"
          :value="r.name[filterStore.lang] || r.name.zh"
        >
          {{ r.name[filterStore.lang] || r.name.zh }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t('nav.city') }}</label>
      <select v-model="filterStore.city" class="filter-select">
        <option value="">{{ t('btn.all') }}</option>
        <option v-for="c in cityOptions" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t('nav.month') }}</label>
      <select v-model="filterStore.month" class="filter-select">
        <option value="">{{ t('btn.all') }}</option>
        <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t('nav.category') }}</label>
      <select v-model="filterStore.category" class="filter-select">
        <option value="all">{{ t('cat.all') }}</option>
        <option value="vegetables">{{ t('cat.vegetables') }}</option>
        <option value="fruits">{{ t('cat.fruits') }}</option>
        <option value="meats">{{ t('cat.meats') }}</option>
        <option value="seafood">{{ t('cat.seafood') }}</option>
        <option value="staples">{{ t('cat.staples') }}</option>
      </select>
    </div>

    <div class="filter-group season-quick">
      <label class="filter-label">{{ t('season.quick') }}</label>
      <div class="season-chips">
        <button
          v-for="s in seasonOptions"
          :key="s.key"
          :class="['season-chip', { active: filterStore.seasonQuick === s.key }]"
          @click="setSeason(s.key, s.months)"
        >
          {{ s.label }}
        </button>
      </div>
      <div class="season-hint" v-if="filterStore.seasonQuick !== 'all'">
        已设置月份：{{ monthsLabel(filterStore.seasonQuick) }}
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">{{ t('nav.search') }}</label>
      <input v-model="filterStore.keyword" type="text" class="filter-input" placeholder="" />
    </div>

    <button class="btn-reset" @click="resetFilters">{{ t('btn.all') }}</button>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { filterStore, t } from '../store.js'

defineProps({
  regions: {
    type: Array,
    required: true
  }
})

const provinceOptions = computed(() => {
  return regions.filter((r) => {
    return true
  })
})

const cityOptions = computed(() => {
  const provinceName = filterStore.province
  if (!provinceName) return []
  const region = regions.find(
    (r) => (r.name[filterStore.lang] || r.name.zh) === provinceName
  )
  return region ? region.cities : []
})

const seasonOptions = [
  { key: 'all', label: t('season.all'), months: [] },
  { key: 'spring', label: t('season.q.spring'), months: [3, 4, 5] },
  { key: 'summer', label: t('season.q.summer'), months: [6, 7, 8] },
  { key: 'autumn', label: t('season.q.autumn'), months: [9, 10, 11] },
  { key: 'winter', label: t('season.q.winter'), months: [12, 1, 2] }
]

const setSeason = (key, months) => {
  filterStore.seasonQuick = key
  // 季节快捷优先级高于单月：选中季节时清空单月，反之亦然
  if (key === 'all') {
    filterStore.month = ''
  } else {
    filterStore.month = ''
  }
  // 将季节月份存入一个临时标记，供父组件过滤时使用
  filterStore._seasonMonths = months
}

const monthsLabel = (key) => {
  const s = seasonOptions.find((o) => o.key === key)
  return s ? s.label : ''
}

const resetFilters = () => {
  filterStore.province = ''
  filterStore.city = ''
  filterStore.month = ''
  filterStore.seasonQuick = 'all'
  filterStore.category = 'all'
  filterStore.keyword = ''
  filterStore._seasonMonths = []
}
</script>

<style scoped>
.filter-panel {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  height: fit-content;
}
.panel-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  margin: 0 0 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.filter-group {
  margin-bottom: 0.85rem;
}
.filter-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.35rem;
}
.filter-select,
.filter-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  box-sizing: border-box;
}
.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.btn-reset {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.55rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
}
.btn-reset:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

/* 季节快捷芯片 */
.season-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.35rem;
}
.season-chip {
  padding: 0.3rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
}
.season-chip:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}
.season-chip.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}
.season-hint {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: #3b82f6;
}
</style>
