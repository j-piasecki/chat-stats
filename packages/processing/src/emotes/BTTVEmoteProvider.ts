/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'

import { Emote } from 'chat-stats-common'
import { EmoteProvider } from './EmoteProvider.js'

export class BTTVEmoteProvider implements EmoteProvider {
  async getGlobalEmotes(): Promise<Emote[]> {
    return fetch('https://api.betterttv.net/3/cached/emotes/global', {
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
        return result.map((emote: any) => this.createEmoteData(emote))
      })
      .catch((reason: any) => {
        console.log('Could not get global BTTV emotes:', reason.message)
        return []
      })
  }

  getChannelEmotes(channelId: string): Promise<Emote[]> {
    // TODO: figure out a way to get BTTV id from Twitch's
    return fetch(`https://api.betterttv.net/3/users/${channelId}`, {
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
        return [
          ...result.channelEmotes.map((emote: any) => this.createEmoteData(emote)),
          ...result.sharedEmotes.map((emote: any) => this.createEmoteData(emote)),
        ]
      })
      .catch((reason: any) => {
        console.log(`Could not get channel (id: ${channelId}) BTTV emotes:`, reason.message)
        return []
      })
  }

  private createEmoteData(from: any): Emote {
    const animated = from.imageType === 'gif'

    return {
      name: from.code,
      id: `bttv_${from.id}`,
      animated: animated,
      urls: [
        `https://cdn.betterttv.net/emote/${from.id}/1x`,
        `https://cdn.betterttv.net/emote/${from.id}/2x`,
        `https://cdn.betterttv.net/emote/${from.id}/2x`,
      ],
    }
  }
}
