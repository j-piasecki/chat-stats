/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'

import { Emote, TwitchAuthHandler } from 'chat-stats-common'
import { EmoteProvider } from './EmoteProvider.js'

export class TwitchEmoteProvider implements EmoteProvider {
  async getGlobalEmotes(): Promise<Emote[]> {
    return fetch('https://api.twitch.tv/helix/chat/emotes/global', {
      method: 'get',
      headers: {
        Authorization: `Bearer ${TwitchAuthHandler.token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
      },
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
        return result.data.map((emote: any) => this.createEmoteData(emote))
      })
      .catch((reason: any) => {
        console.log('Could not get global twitch emotes:', reason.message)
        return []
      })
  }

  async getChannelEmotes(channelId: string): Promise<Emote[]> {
    return fetch(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${channelId}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${TwitchAuthHandler.token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
      },
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
        return result.data.map((emote: any) => this.createEmoteData(emote))
      })
      .catch((reason: any) => {
        console.log(`Could not get channel (id: ${channelId}) twitch emotes:`, reason.message)
        return []
      })
  }

  private createEmoteData(from: any): Emote {
    const animated = from.format.includes('animated') as boolean
    const format = animated ? 'animated' : 'static'

    return {
      name: from.name,
      id: `twitch_${from.id}`,
      animated: animated,
      urls: [
        `https://static-cdn.jtvnw.net/emoticons/v2/${from.id}/${format}/light/1.0`,
        `https://static-cdn.jtvnw.net/emoticons/v2/${from.id}/${format}/light/2.0`,
        `https://static-cdn.jtvnw.net/emoticons/v2/${from.id}/${format}/light/3.0`,
      ],
    }
  }
}
