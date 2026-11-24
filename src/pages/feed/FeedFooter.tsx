import { Link } from 'react-router-dom'
import s from './FeedFooter.module.css'

// FeedFooter — приглашение сдать своё платье под лентой.
export function FeedFooter() {
  return (
    <aside className={s.footer}>
      <p className={s.lead}>Есть платье, которое вы надели всего раз?</p>
      <Link to="/place" className={s.link}>
        Сдайте его на вечер
      </Link>
    </aside>
  )
}
