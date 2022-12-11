/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

// /mostUsedEmotes/:channel
export function getMostUsedEmotesInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before)) || Date.now()
  const startTimestamp = Math.floor(Number(req.query.after)) || endTimestamp - 24 * 60 * 60 * 1000

  Database.getMostUsedEmotesInChannel(channel, startTimestamp, endTimestamp)
    .then((emotes) => {
      res
        .status(200)
        .send(
          JSON.stringify({
            emotes: emotes,
          })
        )
        .end()
    })
    .catch(() => {
      res.status(404).end()
    })
}
