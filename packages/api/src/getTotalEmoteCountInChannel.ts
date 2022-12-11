/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

// /subscriberCount/:channel
export function getTotalEmoteCountInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before)) || Date.now()
  const startTimestamp = Math.floor(Number(req.query.after)) || endTimestamp - 24 * 60 * 60 * 1000

  Database.getTotalEmoteCountInChannel(channel, startTimestamp, endTimestamp)
    .then((count) => {
      res
        .status(200)
        .send(
          JSON.stringify({
            count: count,
          })
        )
        .end()
    })
    .catch(() => {
      res.status(404).end()
    })
}
