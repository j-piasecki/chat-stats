import { User } from './User.js'

// Wzorzec: DTO
export interface Message {
  id: number
  message: string
  timestamp: number
  channel_id: string
  user: User
  game_id: string
  subscriber: boolean
  moderator: boolean
  turbo: boolean
  first_message: boolean
}
