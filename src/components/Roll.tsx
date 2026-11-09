// Roll — подпись кнопки или ссылки: при наведении текст уезжает вверх, снизу выезжает копия.
export default function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
