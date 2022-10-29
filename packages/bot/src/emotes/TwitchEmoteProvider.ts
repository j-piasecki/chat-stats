/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'

import { Emote } from 'chat-stats-common'
import { EmoteProvider } from './EmoteProvider.js'

const REFRESH_TOKEN_BEFORE_DUE = 360

export class TwitchEmoteProvider implements EmoteProvider {
  private _token: string
  private _refreshToken: string

  constructor() {
    this.getToken()
  }

  async getGlobalEmotes(): Promise<Emote[]> {
    return fetch('https://api.twitch.tv/helix/chat/emotes/global', {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this._token}`,
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

  getChannelEmotes(channelId: string): Promise<Emote[]> {
    return fetch(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${channelId}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this._token}`,
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

  private async getToken() {
    const params = new URLSearchParams()
    params.set('client_id', process.env.TWITCH_CLIENT_ID!)
    params.set('client_secret', process.env.TWITCH_CLIENT_SECRET!)
    params.set('code', process.env.TWITCH_CODE!)
    params.set('grant_type', 'authorization_code')
    params.set('redirect_uri', 'http://localhost:3000')

    await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'post',
      body: params,
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
        this._token = result.access_token
        this._refreshToken = result.refresh_token

        setTimeout(() => {
          this.refreshToken()
        }, result.expires_in - REFRESH_TOKEN_BEFORE_DUE)
      })
      .catch((reason: any) => {
        console.log('Could not acquire twitch token:', reason.message)
      })
  }

  private async refreshToken() {
    const params = new URLSearchParams()
    params.set('client_id', process.env.TWITCH_CLIENT_ID!)
    params.set('client_secret', process.env.TWITCH_CLIENT_SECRET!)
    params.set('refresh_token', this._refreshToken)
    params.set('grant_type', 'refresh_token')

    await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'post',
      body: params,
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
        this._token = result.access_token
        this._refreshToken = result.refresh_token

        setTimeout(() => {
          this.refreshToken()
        }, result.expires_in - REFRESH_TOKEN_BEFORE_DUE)
      })
      .catch((reason: any) => {
        console.log('Could not refresh twitch token:', reason.message)
      })
  }
}
