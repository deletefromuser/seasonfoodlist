# AGENTS.md

## Environment
- Node is **not** on the system PATH. It lives at `~/.local/nodejs`. Before any npm/vite command in a new terminal:
  ```bash
  export PATH="$HOME/.local/nodejs/bin:$PATH"
  cd /home/kei/Documents/seasonfoodlist
  ```

## Commands (source of truth: package.json)
- `npm install` — first time only (`node_modules` is gitignored)
- `npm run dev` — Vite dev server at `http://localhost:5173` (port 5173, auto-open; see vite.config.js)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve `dist/` locally

There are **no** `test`, `lint`, or `typecheck` scripts. Do not run them.

## Entry points
- `src/main.js` — mounts `#app`
- `src/App.vue` — root: Header + FilterPanel + food grid + footer
- `src/store.js` — reactive filter state (country/province/city/month/category/keyword/lang) + i18n strings; no Pinia
- `src/services/foodDataService.js` — loads `src/data/<country>/foods.json`; edit here to swap in real data sources

## Data (read before editing)
- `src/data/<country>/regions.json` — provinces/states + cities (codes: cn, us, jp, gb, au, kr, fr, br)
- `src/data/<country>/foods.json` — food items with `nutrition` per 100g
- **All food/nutrition data is demo data**, not official or nutritionally accurate. Do not use for medical/diet purposes. See README.md "数据来源说明".
- To replace with real data: modify `loadFoods` / `fetchNutritionFromUSDA` in `foodDataService.js`. API keys must go through a backend proxy — do not hardcode in frontend.

## Git
- Remote: `git@github.com:deletefromuser/seasonfoodlist.git`, branch `main`
