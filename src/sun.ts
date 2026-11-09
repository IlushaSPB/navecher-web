// Закат и восход в Москве — по ним сайт сам переходит в вечерний режим.
// Формулы NOAA (General Solar Position Calculations), точность — пара минут.
const LAT = 55.7558
const LON = 37.6173
const MSK = 180 // Москва — UTC+3 круглый год

export type Evening = {
  now: number // минуты от полуночи по Москве
  sunrise: number
  sunset: number
  isEvening: boolean
}

export function evening(date = new Date()): Evening {
  const d = new Date(date.getTime() + MSK * 60_000)
  const day = Math.floor((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86_400_000)
  const now = d.getUTCHours() * 60 + d.getUTCMinutes()

  const rad = Math.PI / 180
  const g = ((2 * Math.PI) / 365) * (day - 1)
  const eqtime =
    229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g)
  const cosHa = Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl)
  const ha = Math.acos(Math.min(1, Math.max(-1, cosHa))) / rad

  const sunrise = 720 - 4 * (LON + ha) - eqtime + MSK
  const sunset = 720 - 4 * (LON - ha) - eqtime + MSK
  return { now, sunrise, sunset, isEvening: now >= sunset || now < sunrise }
}

// hhmm — минуты от полуночи в виде «16:47».
export function hhmm(minutes: number) {
  const t = ((Math.round(minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

// until — «2 ч 10 мин» между двумя моментами дня.
function until(from: number, to: number) {
  const m = Math.max(0, Math.round(to - from))
  const h = Math.floor(m / 60)
  return h ? `${h} ч ${m % 60} мин` : `${m} мин`
}

// phrase — подпись к закату: сколько осталось до вечера или что он уже идёт.
export function phrase(e: Evening) {
  if (e.now < e.sunrise) return 'Ночь в Москве'
  if (e.now >= e.sunset) return 'Вечер уже начался'
  return `До вечера ${until(e.now, e.sunset)}`
}
