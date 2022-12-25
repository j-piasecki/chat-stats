import { ChannelStats, EmoteCounter } from 'chat-stats-common'
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
    Query.mostUsedEmotesInChannel(),
  ]

  for (const query of queries) {
    query.forChannel(channel).before(endTimestamp).after(startTimestamp).forPeriod(period)
  }

  StatsRegistry.resolveAll(...queries)
    .then((result) => {
      const body: ChannelStats = {
        firstTimersCount: result[0] as number,
        messageCount: result[1] as number,
        subscriberCount: result[2] as number,
        totalEmoteCount: result[3] as number,
        userCount: result[4] as number,
        mostUsedemotes: result[5] as EmoteCounter,
      }

      res.status(200).send(JSON.stringify(body)).end()
    })
    .catch(() => {
      res.status(404).end()
    })
}
