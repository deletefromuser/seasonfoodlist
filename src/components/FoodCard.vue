<template>
  <article class="food-card" :class="`card-${item.category}`">
    <div class="card-badges">
      <span class="badge badge-cat">{{ catLabel }}</span>
      <span class="badge badge-month">{{ item.month }}月</span>
    </div>
    <h3 class="card-name">{{ name }}</h3>
    <p class="card-loc">{{ item.province }} · {{ item.city }}</p>
    <p class="card-season">
      <span class="card-label">{{ t('label.season') }}：</span>
      {{ season }}
    </p>
    <p class="card-tip">
      <span class="card-label">{{ t('label.tip') }}：</span>
      {{ tip }}
    </p>
    <p class="card-recipe">
      <span class="card-label">{{ t('label.recipe') }}：</span>
      {{ recipe }}
    </p>
    <div v-if="nutrition" class="card-nutrition">
      <div class="nutrition-title">{{ t('label.nutrition') }}</div>
      <div class="nutrition-row">
        <span class="nutrition-item"><span class="nutrition-key">{{ t('label.calories') }}：</span>{{ nutrition.calories }}<span class="unit">{{ t('unit.kcal') }}</span></span>
        <span class="nutrition-item"><span class="nutrition-key">{{ t('label.carbohydrate') }}：</span>{{ nutrition.carbohydrate }}<span class="unit">{{ t('unit.g') }}</span></span>
        <span class="nutrition-item"><span class="nutrition-key">{{ t('label.protein') }}：</span>{{ nutrition.protein }}<span class="unit">{{ t('unit.g') }}</span></span>
        <span class="nutrition-item"><span class="nutrition-key">{{ t('label.fat') }}：</span>{{ nutrition.fat }}<span class="unit">{{ t('unit.g') }}</span></span>
      </div>
      <div class="nutrition-row vitamins">
        <span class="nutrition-key">{{ t('label.vitamins') }}：</span>
        <span v-for="(val, key) in nutrition.vitamins" :key="key" class="nutrition-item">{{ key.toUpperCase() }} {{ val }}<span class="unit">{{ unitForVitamin(key) }}</span></span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { filterStore, t } from '../store.js'

defineProps({
  item: {
    type: Object,
    required: true
  }
})

const lang = computed(() => filterStore.lang)

const name = computed(() => item.name[lang.value] || item.name.zh)
const season = computed(() => item.season[lang.value] || item.season.zh)
const tip = computed(() => item.tip[lang.value] || item.tip.zh)
const recipe = computed(() => item.recipe[lang.value] || item.recipe.zh)

const catLabel = computed(() => t('cat.' + item.category))

const nutrition = computed(() => item.nutrition || null)

const unitForVitamin = (key) => {
  const u = { c: 'mg', a: 'µg', b1: 'mg', b2: 'mg', e: 'mg', k: 'µg', b6: 'mg', b12: 'µg', folate: 'µg' }
  return u[key] || 'mg'
}
</script>

<style scoped>
.food-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s, box-shadow 0.15s;
}
.food-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.card-badges {
  display: flex;
  gap: 0.5rem;
}
.badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-cat {
  background: #e2e8f0;
  color: #334155;
}
.badge-month {
  background: #f1f5f9;
  color: #64748b;
}
.card-name {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}
.card-loc {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}
.card-season,
.card-tip,
.card-recipe {
  margin: 0;
  font-size: 0.85rem;
  color: #334155;
}
.card-label {
  font-weight: 700;
  color: #475569;
}

/* 分类左边框色 */
.card-vegetables {
  border-left: 4px solid #2e7d32;
}
.card-fruits {
  border-left: 4px solid #c62828;
}
.card-meats {
  border-left: 4px solid #1565c0;
}
.card-staples {
  border-left: 4px solid #ef6c00;
}
.card-seafood {
  border-left: 4px solid #0284c7;
}
.card-vegetables .badge-cat { background: #dcfce7; color: #166534; }
.card-fruits .badge-cat { background: #fee2e2; color: #991b1b; }
.card-meats .badge-cat { background: #dbeafe; color: #1e40af; }
.card-staples .badge-cat { background: #fed7aa; color: #9a3412; }
.card-seafood .badge-cat { background: #cffafe; color: #0c4a6e; }

/* 营养成分 */
.card-nutrition {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #cbd5e1;
}
.nutrition-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.4rem;
}
.nutrition-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}
.nutrition-item {
  font-size: 0.78rem;
  color: #334155;
}
.nutrition-key {
  font-weight: 700;
  color: #64748b;
}
.unit {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-left: 0.1rem;
}
.vitamins .nutrition-item {
  font-size: 0.75rem;
}
</style>
