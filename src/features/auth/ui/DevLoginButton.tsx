import { Button } from '@/shared/ui'
import { useAuth } from '../model/AuthContext'

// DevLoginButton — вход тестовым пользователем; показываем, только когда сервер включил DEV_AUTH.
export function DevLoginButton() {
  const { loginDev, status } = useAuth()
  return (
    <Button variant="secondary" disabled={status === 'loading'} onClick={() => void loginDev()}>
      Войти для разработки
    </Button>
  )
}
