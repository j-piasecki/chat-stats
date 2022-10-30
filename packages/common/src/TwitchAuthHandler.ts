/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'

const REFRESH_TOKEN_BEFORE_DUE = 360

export class TwitchAuthHandler {
  private static _token: string
  private static _refreshToken: string

  static get token() {
    return this._token
  }

  public static async acquireToken() {
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

        if (reason.code === 'ETIMEDOUT') {
          console.log('Retrying...')
          this.acquireToken()
        }
      })
  }

  private static async refreshToken() {
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

        if (reason.code === 'ETIMEDOUT') {
          console.log('Retrying...')
          this.refreshToken()
        }
      })
  }
}
