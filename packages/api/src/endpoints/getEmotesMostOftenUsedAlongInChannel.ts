/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'

// /mostUsedEmoteAlong/:channel/emote/:emoteId
export function getEmotesMostOftenUsedAlongInChannel(req: Request, res: Response) {
  const channel = req.params.channel
  const emoteId = req.params.emote

  const endTimestamp = Math.floor(Number(req.query.before))
  const startTimestamp = Math.floor(Number(req.query.after))

  Database.getEmotesMostOftenUsedAlongInChannel(channel, emoteId, startTimestamp, endTimestamp)
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
