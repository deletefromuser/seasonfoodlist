<template>
  <header class="app-header">
    <div class="header-inner">
      <h1 class="app-title">{{ t('app.title') }}</h1>
      <p class="app-subtitle">{{ t('app.subtitle') }}</p>
      <div class="header-controls">
        <div class="control">
          <label class="control-label">{{ t('nav.country') }}</label>
          <select v-model="filterStore.country" class="control-select" @change="resetLocation">
            <option v-for="c in countries" :key="c.code" :value="c.code">
              {{ c.name[filterStore.lang] || c.name.zh }}
            </option>
          </select>
        </div>
        <div class="control">
          <label class="control-label">语言 / Language</label>
          <select v-model="filterStore.lang" class="control-select">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { filterStore, t } from '../store.js'

defineProps({
  countries: {
    type: Array,
    required: true
  }
})

const resetLocation = () => {
  filterStore.region = ''
}
</script>

<style scoped>
.app-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 1rem;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.app-title {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  color: #0f172a;
}
.app-subtitle {
  margin: 0 0 1rem;
  color: #64748b;
  font-size: 0.95rem;
}
.header-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}
.control {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.control-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}
.control-select {
  padding: 0.45rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  min-width: 150px;
}
.control-select:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
</style>
