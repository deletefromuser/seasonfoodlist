import { filterStore } from '../store.js'

/**
 * 时令食物数据服务
 *
 * ⚠️ 数据来源说明：
 *   当前使用的是本地示例 JSON 数据（src/data/<country>/foods.json），
 *   时令月份与营养成分均基于常识整理，**并非来自官方权威数据库**，
 *   仅供参考展示，不宜用于医疗、膳食计算或商业用途。
 *
 * 如需接入真实数据源，可在此替换 loadFoods / searchByEngine 的实现，
 * 并通过后端代理调用（避免将 API Key 暴露在前端）：
 *   - 美国 USDA FoodData Central：https://fdc.nal.usda.gov/
 *   - 中国食物成分表：中国疾病预防控制中心营养与卫生所
 *   - 日本食品成分データベース：文部科学省
 *   - 谷歌/必应搜索引擎 API：需申请密钥，建议后端代理
 */
export const foodDataService = {
  // 当前数据源标识：'local' | 'usda' | 'custom'
  _dataSource: 'local',
  // 本地数据缓存
  _cache: new Map(),

  /**
   * 切换数据源（供外部调用，例如读取 .env 配置）
   * @param {string} source 'local' | 'usda' | 'custom'
   */
  setDataSource(source) {
    this._dataSource = source
    this._cache.clear()
  },

  async loadCountries() {
    const res = await fetch('/src/data/countries.json')
    return res.json()
  },

  async loadRegions(countryCode) {
    const res = await fetch(`/src/data/${countryCode}/regions.json`)
    return res.json()
  },

  async loadFoods(countryCode) {
    // 若已配置为 USDA 数据源，这里应调用 USDA API（需后端代理）
    if (this._dataSource === 'usda') {
      console.warn('USDA 数据源尚未接入，请在 foodDataService.loadFoods 中实现后端代理调用')
      return this._loadLocalFoods(countryCode)
    }
    return this._loadLocalFoods(countryCode)
  },

  async _loadLocalFoods(countryCode) {
    if (this._cache.has(countryCode)) {
      return this._cache.get(countryCode)
    }
    const res = await fetch(`/src/data/${countryCode}/foods.json`)
    const data = await res.json()
    this._cache.set(countryCode, data)
    return data
  },

  /**
   * 根据筛选条件查询食物
   * @param {Object} params {country, province, city, month, category, keyword}
   * @returns {Array}
   */
  async query(params) {
    const foods = await this.loadFoods(params.country || filterStore.country)
    return foods.filter((item) => {
      if (params.province && item.province !== params.province) return false
      if (params.city && item.city !== params.city) return false
      if (params.month && item.month !== params.month) return false
      if (params.category && params.category !== 'all' && item.category !== params.category) return false
      if (params.keyword) {
        const k = params.keyword.toLowerCase()
        const name = (item.name.zh || '') + ' ' + (item.name.en || '')
        return name.toLowerCase().includes(k)
      }
      return true
    })
  },

  /**
   * 预留：通过搜索引擎查询时令食物（需后端代理 + API 密钥）
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchByEngine(query) {
    console.warn('搜索引擎接口尚未配置，请在 foodDataService.searchByEngine 中接入后端代理')
    return []
  },

  /**
   * 预留：通过 USDA FoodData Central 查询营养成分（需后端代理 + API 密钥）
   * @param {string} foodName
   * @returns {Promise<Object|null>}
   */
  async fetchNutritionFromUSDA(foodName) {
    console.warn('USDA 营养接口尚未接入，请在 foodDataService.fetchNutritionFromUSDA 中实现后端代理调用')
    return null
  }
}
