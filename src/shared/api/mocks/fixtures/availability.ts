import { monthGrid, type IsoDate, type IsoMonth } from '@/shared/lib/date'

// Занятость платьев в моках — детерминированная: примерно каждый пятый вечер занят, у каждого платья свои дни.
export const isBusy = (itemId: number, date: IsoDate) => (Number(date.slice(8, 10)) + itemId * 3) % 5 === 0

export const busyDays = (itemId: number, month: IsoMonth): IsoDate[] =>
  monthGrid(month)
    .filter((cell) => cell.inMonth && isBusy(itemId, cell.date))
    .map((cell) => cell.date)
