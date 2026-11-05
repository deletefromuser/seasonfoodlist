# 时令食物列表 (Seasonal Food List)

基于 Vue 3 + Vite 的时令食物查询应用，支持按**国家 → 省/州 → 城市 → 月份**筛选，展示蔬菜、水果、肉类、主食、海鲜/水产，并附每100g营养成分参考。

## ✨ 功能特点
- 多国时令食材：中国、美国、日本、英国、澳大利亚、韩国、法国、巴西
- 省/州 → 城市三级联动筛选
- 月份 / 季节快捷（春夏秋冬）筛选
- 分类筛选：蔬菜、水果、肉类、主食、海鲜/水产
- 关键词搜索食物名称
- 食物卡片显示：季节、选购建议、搭配食谱、营养成分（每100g）
- 中英文界面切换
- 响应式布局，适配手机/平板/桌面

## ⚠️ 数据来源说明（重要）
当前项目使用的是 **本地示例数据**（`src/data/<country>/foods.json`）：
- 时令月份、选购建议、食谱搭配：基于常识整理，非官方农业/气象数据
- 营养成分（热量、碳水、蛋白质、脂肪、维生素）：按食物大类套用模板，**并非真实检测数值**

**请勿将本项目的营养数据用于医疗、膳食计算或商业用途。**

如需生产环境使用，请替换为真实权威数据源（见下文）。

## 📁 项目结构
```
seasonfoodlist/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── store.js                 # 筛选状态 + 多语言文本
│   ├── services/
│   │   └── foodDataService.js   # 数据加载 + 预留真实数据源接口
│   ├── components/
│   │   ├── Header.vue           # 国家/语言切换
│   │   ├── FilterPanel.vue      # 省/市/月份/季节/分类/搜索
│   │   └── FoodCard.vue         # 食物卡片（含营养成分）
│   └── data/
│       ├── countries.json       # 国家列表
│       ├── cn/us/jp/gb/au/kr/fr/br/
│       │   ├── regions.json     # 省/州 + 城市
│       │   └── foods.json       # 时令食材 + 营养成分（示例数据）
├── dist/                        # 生产构建产物
└── README.md
```

## 🚀 运行与构建
本环境 Node 已安装到 `~/.local/nodejs`，每次新终端需先加入 PATH：

```bash
export PATH="$HOME/.local/nodejs/bin:$PATH"
cd /home/kei/Documents/seasonfoodlist

# 安装依赖（首次）
npm install

# 开发服务器（http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 🔌 如何接入真实数据源

### 1. 替换时令食材数据
修改 `src/services/foodDataService.js` 中的 `loadFoods` 方法，将本地 JSON 加载替换为你的后端代理接口：

```javascript
async loadFoods(countryCode) {
  // 示例：调用你的后端代理
  const res = await fetch(`/api/seasonal-foods?country=${countryCode}`)
  return res.json()
}
```

### 2. 接入 USDA FoodData Central（营养成分）
USDA 提供官方食品营养数据库：https://fdc.nal.usda.gov/

在 `foodDataService.js` 的 `fetchNutritionFromUSDA` 中实现后端代理调用：

```javascript
async fetchNutritionFromUSDA(foodName) {
  const res = await fetch(`/api/usda/nutrition?query=${encodeURIComponent(foodName)}`)
  const data = await res.json()
  return {
    calories: data.calories,
    carbohydrate: data.carbohydrate,
    protein: data.protein,
    fat: data.fat,
    vitamins: data.vitamins
  }
}
```

> **注意**：API Key 不应硬编码在前端，请务必通过后端代理转发请求。

### 3. 接入中国食物成分表
可联系中国疾病预防控制中心营养与卫生所获取《中国食物成分表》官方数据，或使用已有的开源食物成分数据集，同样建议通过后端代理提供 API。

## 🛠 技术栈
- Vue 3 (Composition API, `<script setup>`)
- Vite
- 原生 CSS（无 Tailwind / Bootstrap 等框架）
- 轻量级 reactive Store（无 Pinia）

## 📄 许可
本项目仅供学习演示使用，数据为示例数据，请勿用于商业或医疗用途。
