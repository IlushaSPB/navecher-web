import { nb } from '../api'

// Lines — строки заголовка; у родителя с data-reveal="lines" они выезжают из-под маски по очереди.
// Предлоги приклеены к следующему слову: «Коротко о главном» не разорвётся на «о / главном».
// tail — что-то мелкое после последней строки (например, счётчик), едет вместе с ней.
export default function Lines({ lines, tail }: { lines: string[]; tail?: React.ReactNode }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className="line" style={{ '--i': i } as React.CSSProperties}>
          <span>
            {nb(l)}
            {i === lines.length - 1 && tail}
          </span>
        </span>
      ))}
    </>
  )
}
