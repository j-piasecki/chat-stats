import { Request, Response } from 'express'

import { Query } from '../query/Query.js'
import { StatsRepository } from '../StatsRepository.js'

// /emoteCount/:channel
export function getTotalEmoteCountInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))
  const period = Math.floor(Number(req.query.period))

  const query = Query.totalEmoteCountInChannel()
    .forChannel(channel)
    .before(endTimestamp)
    .after(startTimestamp)
    .forPeriod(period)

  StatsRepository.resolve(query)
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
