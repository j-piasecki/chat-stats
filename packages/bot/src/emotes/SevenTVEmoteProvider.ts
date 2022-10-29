/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'

import { Emote } from 'chat-stats-common'
import { EmoteProvider } from './EmoteProvider.js'

export class SevenTVEmoteProvider implements EmoteProvider {
  async getGlobalEmotes(): Promise<Emote[]> {
    return fetch('https://7tv.io/v3/emote-sets/62cdd34e72a832540de95857', {
      method: 'get',
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return response.json().then((data) => {
            throw data
          })
        }
      })
      .then((result: any) => {
        return result.emotes.map((emote: any) => this.createEmoteData(emote))
      })
      .catch((reason: any) => {
        console.log('Could not get global 7TV emotes:', reason.message)
        return []
      })
  }

  getChannelEmotes(channelId: string): Promise<Emote[]> {
    return fetch(`https://7tv.io/v3/users/twitch/${channelId}`, {
      method: 'get',
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return response.json().then((data) => {
            throw data
          })
        }
      })
      .then((result: any) => {
        return result.emote_set.emotes.map((emote: any) => this.createEmoteData(emote))
      })
      .catch((reason: any) => {
        console.log(`Could not get channel (id: ${channelId}) 7TV emotes:`, reason.message)
        return []
      })
  }

  private createEmoteData(from: any): Emote {
    const animated = from.data.animated as boolean

    return {
      name: from.name,
      id: `7tv_${from.id}`,
      animated: animated,
      urls: [
        `https:${from.data.host.url}/1x.webp`,
        `https:${from.data.host.url}/2x.webp`,
        `https:${from.data.host.url}/3x.webp`,
      ],
    }
  }
}
