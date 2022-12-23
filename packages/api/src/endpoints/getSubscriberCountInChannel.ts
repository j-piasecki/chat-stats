import { Request, Response } from 'express'

import { Query } from '../query/Query.js'
import { StatsRegistry } from '../StatsRegistry.js'

// /subscriberCount/:channel
export function getSubscriberCountInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))
  const period = Math.floor(Number(req.query.period))

  const query = Query.subscriberCountInChannel()
    .forChannel(channel)
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
