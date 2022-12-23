import { Request, Response } from 'express'

import { Query } from '../query/Query.js'
import { StatsRegistry } from '../StatsRegistry.js'

// /stats/:channel
export function getChannelStats(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))
  const period = Math.floor(Number(req.query.period))

  const queries = [
    Query.firstTimerCountInChannel(),
    Query.messageCountInChannel(),
    Query.subscriberCountInChannel(),
    Query.totalEmoteCountInChannel(),
    Query.userCountInChannel(),
  ]

  for (const query of queries) {
    query.forChannel(channel).before(endTimestamp).after(startTimestamp).forPeriod(period)
  }

  StatsRegistry.resolveAll(...queries)
    .then((result) => {
      res
        .status(200)
        .send(
          JSON.stringify({
            firstTimersCount: result[0],
            messageCount: result[1],
            subscriberCount: result[2],
            totalEmoteCount: result[3],
            userCount: result[4],
          })
        )
        .end()
    })
    .catch(() => {
      res.status(404).end()
    })
}
