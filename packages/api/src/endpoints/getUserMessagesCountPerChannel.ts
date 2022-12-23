import { Request, Response } from 'express'

import { Query } from '../query/Query.js'
import { StatsRegistry } from '../StatsRegistry.js'

// /messageCountPerChannel/:user
export function getUserMessagesCountPerChannel(req: Request, res: Response) {
  const user = req.params.user

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))
  const period = Math.floor(Number(req.query.period))

  const query = Query.userMessagesCountPerChannelQuery()
    .forUser(user)
    .before(endTimestamp)
    .after(startTimestamp)
    .forPeriod(period)

  StatsRegistry.resolve(query)
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
