import { Emote, sleep } from 'chat-stats-common'
import { GeneralEmoteProvider } from './GeneralEmoteProvider.js'

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
  private globalEmotesLock = false

  private channelEmotes: Map<string, CachedEmotes> = new Map()
  private channelEmoteLocks: Map<string, boolean> = new Map()

  public async getEmotesForChannel(channelId: string): Promise<Emote[]> {
    return await Promise.all([this.getGlobalEmotes(), this.getChannelEmotes(channelId)]).then(
      (data) => {
        const result = [...data[1]]

        for (const emote of data[0]) {
          if (result.find((e) => e.name === emote.name) === undefined) {
            result.push(emote)
          }
        }

        return result
      }
    )
  }

  private async getGlobalEmotes(): Promise<Emote[]> {
    while (this.globalEmotesLock === true) {
      await sleep(50)
    }

    if (Date.now() - this.globalEmotesUpdateTimestamp > GLOBAL_EMOTES_REFRESH_PERIOD) {
      this.globalEmotesLock = true
      console.log('Fetching global emotes')

      const emotes = await this.emoteProvider.getGlobalEmotes()
      this.globalEmotesLock = false

      this.globalEmotes = emotes
      this.globalEmotesUpdateTimestamp = Date.now()

      return emotes
    } else {
      return this.globalEmotes
    }
  }

  private async getChannelEmotes(channelId: string): Promise<Emote[]> {
    while (this.channelEmoteLocks.get(channelId) === true) {
      await sleep(50)
    }

    const cache = this.channelEmotes.get(channelId)

    if (cache === undefined || Date.now() - cache.timestamp > CHANNEL_EMOTES_REFRESH_PERIOD) {
      this.channelEmoteLocks.set(channelId, true)
      console.log('Fetching channel emotes for channel', channelId)

      const emotes = await this.emoteProvider.getChannelEmotes(channelId)
      this.channelEmoteLocks.delete(channelId)

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
