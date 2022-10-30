import { Game, TwitchAuthHandler, sleep } from 'chat-stats-common'

const CHANNEL_GAME_REFRESH_PERIOD = 1000 * 60 * 5

type CachedGame = {
  timestamp: number
  game: Game
}

export class GameRegistry {
  private authHandler = new TwitchAuthHandler()
  private channelGames: Map<string, CachedGame> = new Map()

  public async getChannelGame(channelId: string): Promise<Game> {
    const cache = this.channelGames.get(channelId)

    if (cache === undefined || Date.now() - cache.timestamp > CHANNEL_GAME_REFRESH_PERIOD) {
      console.log('Fetching game info for channel', channelId)

      while (this.authHandler.token === undefined) {
        await sleep(50)
      }

      const gameData = await fetch(`https://api.twitch.tv/helix/streams?user_id=${channelId}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.authHandler.token}`,
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
        .then((result: any): Game => {
          if (result.data.length === 0) {
            throw new Error('Channel is offline')
          }

          return {
            id: result.data[0].game_id,
            name: result.data[0].game_name,
            thumbnailUrl: result.data[0].thumbnail_url,
          }
        })
        .catch((reason: any): Game => {
          console.log('Could not get game data for channel', channelId, reason.message)
          return {
            id: '-1',
            name: 'Offline/System error',
            thumbnailUrl: '',
          }
        })

      this.channelGames.set(channelId, {
        timestamp: Date.now(),
        game: gameData,
      })

      return gameData
    } else {
      return cache.game
    }
  }
}
