import { Emote } from 'chat-stats-common'
import { BTTVEmoteProvider } from './BTTVEmoteProvider.js'
import { EmoteProvider } from './EmoteProvider.js'
import { SevenTVEmoteProvider } from './SevenTVEmoteProvider.js'
import { TwitchEmoteProvider } from './TwitchEmoteProvider.js'

// Wzorzec: Remote Facade
export class GeneralEmoteProvider implements EmoteProvider {
  private providers: EmoteProvider[] = []

  constructor() {
    this.providers.push(new TwitchEmoteProvider())
    this.providers.push(new SevenTVEmoteProvider())
    this.providers.push(new BTTVEmoteProvider())
  }

  async getGlobalEmotes(): Promise<Emote[]> {
    return await Promise.all(this.providers.map((provider) => provider.getGlobalEmotes())).then(
      (data) => data.flat()
    )
  }

  async getChannelEmotes(channelId: string): Promise<Emote[]> {
    return await Promise.all(
      this.providers.map((provider) => provider.getChannelEmotes(channelId))
    ).then((data) => data.flat())
  }
}
