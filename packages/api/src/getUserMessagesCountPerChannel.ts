/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

// /messageCountPerChannel/:user
export function getUserMessagesCountPerChannel(req: Request, res: Response) {
  const user = req.params.user

  const endTimestamp = Math.floor(Number(req.query.before)) || Date.now()
  const startTimestamp = Math.floor(Number(req.query.after)) || endTimestamp - 24 * 60 * 60 * 1000

  Database.getUserMessagesCountPerChannel(user, startTimestamp, endTimestamp)
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
