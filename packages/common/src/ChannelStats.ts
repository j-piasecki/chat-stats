import { EmoteCounter } from './Emote.js'

// Wzorzec: Value Object
export interface ChannelStats {
  firstTimersCount: number
  messageCount: number
  subscriberCount: number
  totalEmoteCount: number
  userCount: number
  mostUsedEmotes: EmoteCounter[]
}
