import { Game, sleep, TwitchAuthHandler } from 'chat-stats-common'

const CHANNEL_GAME_REFRESH_PERIOD = 1000 * 60 * 5

type CachedGame = {
  timestamp: number
  game: Game
}

const ERROR_GAME_DATA: Game = {
  id: '-2',
  name: 'System error',
}

export class GameRegistry {
  private channelGames: Map<string, CachedGame> = new Map()
  private channelLocks: Map<string, boolean> = new Map()

  public async getChannelGame(channelId: string): Promise<Game> {
    while (this.channelLocks.get(channelId) === true) {
      await sleep(50)
    }

    const cache = this.channelGames.get(channelId)

    if (cache === undefined || Date.now() - cache.timestamp > CHANNEL_GAME_REFRESH_PERIOD) {
      if (TwitchAuthHandler.token === undefined) {
        console.log(`Skipping fetching game data for channel ${channelId}: not authenticated`)

        this.channelGames.set(channelId, {
          timestamp: Date.now(),
          game: ERROR_GAME_DATA,
        })
        return ERROR_GAME_DATA
      }

      this.channelLocks.set(channelId, true)
      console.log('Fetching game info for channel', channelId)

      const gameData = await fetch(`https://api.twitch.tv/helix/streams?user_id=${channelId}`, {
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
        .then((result: any): Game => {
          if (result.data.length === 0) {
            return {
              id: '-1',
              name: 'Offline',
            }
          }

          return {
            id: result.data[0].game_id,
            name: result.data[0].game_name,
          }
        })
        .catch((reason: any): Game => {
          console.log('Could not get game data for channel', channelId, reason.message)
          return ERROR_GAME_DATA
        })

      this.channelGames.set(channelId, {
        timestamp: Date.now(),
        game: gameData,
      })
      this.channelLocks.delete(channelId)

      return gameData
    } else {
      return cache.game
    }
  }
}
