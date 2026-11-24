import { describe, expect, it } from 'vitest'
import { capitalize, dateLong, dateShort, dayMonth, initials, monthTitle, nb, plural, rating, rub } from './format'

// Intl для ru-RU разделяет разряды неразрывным пробелом
const NBSP = ' '

describe('деньги и рейтинг', () => {
  it('rub — разряды через неразрывный пробел и знак ₽', () => {
    expect(rub(4500)).toBe(`4${NBSP}500 ₽`)
    expect(rub(120_000)).toBe(`120${NBSP}000 ₽`)
    expect(rub(900)).toBe('900 ₽')
  })

  it('rating — один знак после запятой', () => {
    expect(rating(5)).toBe('5,0')
    expect(rating(4.75)).toBe('4,8')
  })
})

describe('даты по-русски', () => {
  it('день, месяц и день недели', () => {
    expect(dayMonth('2026-12-12')).toBe('12 декабря')
    expect(dateShort('2026-12-12')).toBe('сб, 12 декабря')
    expect(capitalize(dateShort('2026-03-01'))).toBe('Вс, 1 марта')
    expect(dateLong('2026-12-14')).toBe('понедельник, 14 декабря')
  })

  it('название месяца — с заглавной и без «г.»', () => {
    expect(monthTitle('2026-12')).toBe('Декабрь 2026')
    expect(monthTitle('2027-01')).toBe('Январь 2027')
  })

  it('неверная дата — пустая строка, а не «undefined»', () => {
    expect(dayMonth('2026-02-30')).toBe('')
  })
})

describe('тексты', () => {
  it.each([
    [1, 'раз'],
    [2, 'раза'],
    [5, 'раз'],
    [11, 'раз'],
    [21, 'раз'],
    [22, 'раза'],
    [112, 'раз'],
  ])('plural(%i) → %s', (n, word) => {
    expect(plural(n, 'раз', 'раза', 'раз')).toBe(word)
  })

  it('nb — неразрывный пробел после коротких предлогов', () => {
    expect(nb('платье с разрезом')).toBe(`платье с${NBSP}разрезом`)
  })

  it('initials — две первые буквы имени', () => {
    expect(initials('Мария Волкова')).toBe('МВ')
    expect(initials('  анна ')).toBe('А')
  })
})
