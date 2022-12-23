/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

// /userCount/:channel
export function getUserCountInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))

  Database.getUserCountInChannel(channel, startTimestamp, endTimestamp)
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
