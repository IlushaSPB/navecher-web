import { authHandlers } from './auth'
import { catalogHandlers } from './catalog'
import { configHandlers } from './config'

// Все моки API. Новый раздел — свой файл рядом (orders.ts → ordersHandlers) и строка здесь.
export const handlers = [...configHandlers, ...authHandlers, ...catalogHandlers]
