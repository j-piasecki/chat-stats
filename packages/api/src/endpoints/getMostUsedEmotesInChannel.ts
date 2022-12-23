import { Request, Response } from 'express'

import { Query } from '../query/Query.js'
import { StatsRegistry } from '../StatsRegistry.js'

// /mostUsedEmotes/:channel
export function getMostUsedEmotesInChannel(req: Request, res: Response) {
  const channel = req.params.channel

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))
  const period = Math.floor(Number(req.query.period))

  const query = Query.mostUsedEmotesInChannel()
    .forChannel(channel)
    .before(endTimestamp)
    .after(startTimestamp)
    .forPeriod(period)

  StatsRegistry.resolve(query)
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
