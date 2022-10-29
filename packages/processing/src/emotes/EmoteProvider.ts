import { Emote } from 'chat-stats-common'

export interface EmoteProvider {
  getGlobalEmotes(): Promise<Emote[]>
  getChannelEmotes(channelId: string): Promise<Emote[]>
}
