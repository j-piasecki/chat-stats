/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

// /firstTimers/:channel
export function getFirstTimerCountInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))

  Database.getFirstTimerCountInChannel(channel, startTimestamp, endTimestamp)
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
