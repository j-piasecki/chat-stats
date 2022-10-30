import { Emote } from 'chat-stats-common'
import { GeneralEmoteProvider } from './emotes/GeneralEmoteProvider.js'

const GLOBAL_EMOTES_REFRESH_PERIOD = 1000 * 60 * 60 * 24
const CHANNEL_EMOTES_REFRESH_PERIOD = 1000 * 60 * 60

type CachedEmotes = {
  timestamp: number
  emotes: Emote[]
}

export class EmoteRegistry {
  private emoteProvider = new GeneralEmoteProvider()

  private globalEmotesUpdateTimestamp = 0
  private globalEmotes: Emote[] = []

  private channelEmotes: Map<string, CachedEmotes> = new Map()

  public async getEmotesForChannel(channelId: string): Promise<Emote[]> {
    return await Promise.all([this.getGlobalEmotes(), this.getChannelEmotes(channelId)]).then(
      (data) => data.flat()
    )
  }

  private async getGlobalEmotes(): Promise<Emote[]> {
    if (Date.now() - this.globalEmotesUpdateTimestamp > GLOBAL_EMOTES_REFRESH_PERIOD) {
      console.log('Fetching global emotes')

      const emotes = await this.emoteProvider.getGlobalEmotes()

      this.globalEmotes = emotes
      this.globalEmotesUpdateTimestamp = Date.now()

      return emotes
    } else {
      return this.globalEmotes
    }
  }

  private async getChannelEmotes(channelId: string): Promise<Emote[]> {
    const cache = this.channelEmotes.get(channelId)

    if (cache === undefined || Date.now() - cache.timestamp > CHANNEL_EMOTES_REFRESH_PERIOD) {
      console.log('Fetching channel emotes for channel', channelId)

      const emotes = await this.emoteProvider.getChannelEmotes(channelId)

      this.channelEmotes.set(channelId, {
        timestamp: Date.now(),
        emotes: emotes,
      })

      return emotes
    } else {
      return cache.emotes
    }
  }
}
