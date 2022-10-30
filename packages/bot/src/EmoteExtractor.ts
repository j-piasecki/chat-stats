import { EmoteCounter } from 'chat-stats-database'
import type tmi from 'tmi.js'
import { EmoteRegistry } from './emotes/EmoteRegistry.js'

export class EmoteExtractor {
  private emoteRegistry = new EmoteRegistry()

  public async extractEmotes(message: string, user: tmi.ChatUserstate): Promise<EmoteCounter[]> {
    const emotes = await this.emoteRegistry.getEmotesForChannel(user['room-id']!)
    const words = message.split(' ')
    const result: EmoteCounter[] = []

    for (const emote of emotes) {
      let count = 0

      for (const word of words) {
        if (emote.name === word) {
          count++
        }
      }

      if (count !== 0) {
        result.push({ ...emote, count: count })
      }
    }

    return result
  }
}
