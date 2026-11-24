// Правила слоёв Feature-Sliced Design на no-restricted-imports.
//
// 1. Зависимости только вниз: app → pages → features → entities → shared.
// 2. Слайсы одного слоя не импортируют друг друга (features/a ↛ features/b); сегменты shared — могут.
// 3. Чужой слайс — только через публичный API @/<слой>/<слайс> (index.ts), без внутренних путей.
// 4. Относительный импорт не выходит за свой слайс (../../) — для этого есть @/.
//
// Правило 4 зависит от глубины файла, а настройки no-restricted-imports в flat config не складываются,
// поэтому на каждую пару «слайс-юнит × глубина» генерируется свой блок с полным набором запретов.
import { readdirSync } from 'node:fs'

const LAYERS = ['app', 'pages', 'features', 'entities', 'shared']
const SLICED = new Set(['pages', 'features', 'entities'])
const ORDER = LAYERS.join(' → ')
const MAX_DEPTH = 4
const EXT = '*.{ts,tsx}'

// shared открыт по сегментам (@/shared/ui, @/shared/api…), а lib, styles и моки — по модулям.
const SHARED_DEEP = /^@\/shared\/(?!(?:lib|styles|api\/mocks)\/[^/]+$)[^/]+\/.+/.source

function layerPatterns(layer) {
  const i = LAYERS.indexOf(layer)
  const patterns = LAYERS.slice(0, i).map((upper) => ({
    group: [`@/${upper}`, `@/${upper}/**`],
    message: `Слой ${layer} не может импортировать ${upper}: зависимости идут только вниз (${ORDER}).`,
  }))
  if (SLICED.has(layer)) {
    patterns.push({
      group: [`@/${layer}/**`],
      message: `Слайсы ${layer} не импортируют друг друга: общее опустите слоем ниже. Внутри своего слайса — ./ и ../.`,
    })
  }
  for (const lower of LAYERS.slice(i + 1).filter((l) => SLICED.has(l))) {
    patterns.push({
      group: [`@/${lower}/*/**`],
      message: `Импорт только через публичный API: @/${lower}/<слайс> (его index.ts). Нужного нет — добавьте в index.ts.`,
    })
  }
  patterns.push({
    regex: SHARED_DEEP,
    message:
      'shared импортируется по сегментам: @/shared/ui, @/shared/api…; по модулям — только @/shared/lib/<модуль>.',
  })
  return patterns
}

const escapePattern = (depth, unit) => ({
  regex: `^(\\.\\./){${depth + 1}}`,
  message: `Относительный импорт выходит за пределы ${unit}. Импортируйте через @/ (публичный API слайса).`,
})

const selfPattern = (segment) => ({
  regex: `^@/shared/${segment}(/|$)`,
  message: `Внутри shared/${segment} импорты относительные (./…): через @/ получится круг через index.ts.`,
})

// Блоки одного юнита (слайса, сегмента shared или всего app) — по одному на глубину файла внутри него.
function unitBlocks(root, unit, patterns) {
  return Array.from({ length: MAX_DEPTH + 1 }, (_, depth) => ({
    name: `fsd/${unit}/depth-${depth}`,
    files: [`${root}/${'*/'.repeat(depth)}${depth === MAX_DEPTH ? '**/' : ''}${EXT}`],
    rules: {
      'no-restricted-imports': ['error', { patterns: [...patterns, escapePattern(depth, unit)] }],
    },
  }))
}

// fsdLayers — блоки flat config для src: слои, слайсы и сегменты shared читаются с диска.
export function fsdLayers(src) {
  return LAYERS.flatMap((layer) => {
    const patterns = layerPatterns(layer)
    if (layer === 'app') return unitBlocks(`${src}/app`, 'app', patterns)
    if (SLICED.has(layer)) return unitBlocks(`${src}/${layer}/*`, `слайса ${layer}/*`, patterns)
    return readdirSync(`${src}/shared`, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .flatMap((d) =>
        unitBlocks(`${src}/shared/${d.name}`, `сегмента shared/${d.name}`, [...patterns, selfPattern(d.name)]),
      )
  })
}
