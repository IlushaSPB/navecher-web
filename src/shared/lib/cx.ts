// cx — склейка классов: пустые и false пропускаются.
export const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ')
