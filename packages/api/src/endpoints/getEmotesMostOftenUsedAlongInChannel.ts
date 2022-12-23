import { Request, Response } from 'express'

import { Query } from '../query/Query.js'
import { StatsRegistry } from '../StatsRegistry.js'

// /mostUsedEmoteAlong/:channel/emote/:emoteId
export function getEmotesMostOftenUsedAlongInChannel(req: Request, res: Response) {
  const channel = req.params.channel
  const emoteId = req.params.emote

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))
  const period = Math.floor(Number(req.query.period))

  const query = Query.emotesMostOftenUsedAlongInChannel()
    .forChannel(channel)
    .forEmote(emoteId)
    .before(endTimestamp)
    .after(startTimestamp)
    .forPeriod(period)

  StatsRegistry.resolve(query)
    .then((emoteCounter) => {
      res
        .status(200)
        .send(
          JSON.stringify({
            emotes: emoteCounter,
          })
        )
        .end()
    })
    .catch(() => {
      res.status(404).end()
    })
}
