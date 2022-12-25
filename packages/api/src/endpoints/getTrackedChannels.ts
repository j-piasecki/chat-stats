import { Channel } from 'chat-stats-common'
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

let cachedChannels: Channel[] | null = null
let cacheTimestamp = 0

// /trackedChannels/
export function getTrackedChannels(req: Request, res: Response) {
  if (Date.now() - cacheTimestamp < 24 * 60 * 60 * 1000) {
    console.log('cache hit')
    res
      .status(200)
      .send(
        JSON.stringify({
          channels: cachedChannels,
        })
      )
      .end()
  } else {
    Database.getTrackedChannels()
      .then((channels) => {
        cachedChannels = channels
        cacheTimestamp = Date.now()

        res
          .status(200)
          .send(
            JSON.stringify({
              channels: channels,
            })
          )
          .end()
      })
      .catch(() => {
        res.status(404).end()
      })
  }
}
