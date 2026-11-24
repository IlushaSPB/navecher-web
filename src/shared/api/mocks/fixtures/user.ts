import type { User } from '../../types'

// Токен, который мок-сервер выдаёт при любом входе и узнаёт в /api/me.
export const MOCK_TOKEN = 'mock-session-token'

// MOCK_USER — тестовый пользователь, как при DEV_AUTH на настоящем сервере (tgId 1001).
export const MOCK_USER: User = {
  id: 1,
  tgId: 1001,
  username: 'test_user',
  firstName: 'Тест',
  lastName: '',
  photoUrl: '',
  approved: true,
}
