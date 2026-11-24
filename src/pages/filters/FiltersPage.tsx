import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItemsTotal } from '@/entities/item'
import { toItemsQuery, useCatalogFilters, useCatalogOptions, useFilterDraft } from '@/features/catalog-filters'
import { monthOf, type IsoMonth } from '@/shared/lib/date'
import { plural, rub } from '@/shared/lib/format'
import {
  ActionBar,
  Button,
  HeaderClose,
  HeaderTextAction,
  MonthCalendar,
  RangeSlider,
  Screen,
  Section,
  SegmentedChoice,
  SwatchChoice,
  TaskHeader,
} from '@/shared/ui'

const showLabel = (total: number | null) => {
  if (total === null) return 'Показать платья'
  if (total === 0) return 'Ничего не нашлось'
  return `Показать ${total} ${plural(total, 'платье', 'платья', 'платьев')}`
}

// FiltersPage — черновик фильтров ленты; в адрес ленты попадает по кнопке «Показать».
export function FiltersPage() {
  const navigate = useNavigate()
  const { filters, hrefTo, today } = useCatalogFilters()
  const { draft, set, toggle, reset } = useFilterDraft(filters)
  const { sizes, colors, price } = useCatalogOptions()
  // пока не листали — месяц выбранной даты или текущий (today уточняется, когда придут настройки)
  const [pickedMonth, setMonth] = useState<IsoMonth | null>(null)
  const month = pickedMonth ?? monthOf(draft.date ?? today)
  const { total, pending } = useItemsTotal(toItemsQuery(draft))

  const priceValue = Math.min(draft.priceMax ?? price.max, price.max)

  const onReset = () => {
    reset()
    setMonth(null)
  }

  return (
    <Screen>
      <TaskHeader
        title="Фильтры"
        start={<HeaderClose to={hrefTo('/')} back />}
        end={<HeaderTextAction onClick={onReset}>Сбросить</HeaderTextAction>}
      />
      <Section>
        <MonthCalendar
          title="Когда нужно платье"
          month={month}
          onMonthChange={setMonth}
          minDate={today}
          selected={draft.date}
          onSelect={(date) => toggle('date', date)}
        />
      </Section>
      <Section title="Размер" loose>
        <SegmentedChoice
          label="Размер"
          options={sizes.map((size) => ({ value: size, label: size }))}
          value={draft.size}
          onChange={(size) => toggle('size', size)}
        />
      </Section>
      <Section title="Цена за вечер" aside={`до ${rub(priceValue)}`} loose>
        <RangeSlider
          label="Цена за вечер, до"
          min={price.min}
          max={price.max}
          step={price.step}
          value={priceValue}
          valueText={`до ${rub(priceValue)}`}
          // крайнее правое положение — без ограничения цены
          onChange={(v) => set('priceMax', v >= price.max ? null : v)}
        />
      </Section>
      {colors.length > 0 && (
        <Section title="Цвет" loose>
          <SwatchChoice
            label="Цвет"
            options={colors.map((c) => ({ value: c.id, label: c.label, color: c.hex }))}
            value={draft.color}
            onChange={(color) => toggle('color', color)}
          />
        </Section>
      )}
      <ActionBar divider>
        <Button
          aria-busy={pending}
          disabled={total === 0}
          onClick={() => navigate(hrefTo('/', draft), { replace: true })}
        >
          {showLabel(total)}
        </Button>
      </ActionBar>
    </Screen>
  )
}
