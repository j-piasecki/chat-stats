import { Message } from 'chat-stats-common'
import { Database } from 'chat-stats-database'
import { Request, Response } from 'express'
import {
  clamp,
  DEFAULT_REQUESTED_MESSAGES,
  MIN_REQUESTED_MESSAGES,
  MAX_REQUESTED_MESSAGES,
  MAX_INT,
} from '../utils.js'

// /channel/:channel
export function getMessagesInChannel(req: Request, res: Response) {
  const response: { messages: Message[]; end: boolean } = { messages: [], end: false }
  const amount = clamp(
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    Math.floor(Number(req.query.amount)) || DEFAULT_REQUESTED_MESSAGES,
    MIN_REQUESTED_MESSAGES,
    MAX_REQUESTED_MESSAGES
  )
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const lastMessage = Math.floor(Number(req.query.last)) || MAX_INT
  const channel = req.params.channel

  if (Number.isNaN(lastMessage) || Number.isNaN(amount)) {
    res.status(400).end()
    return
  }

  // fetch one more message than requested to see if we reached the end of history
  Database.getMessagesInChannel(channel, amount + 1, lastMessage)
    .then((messages) => {
      // don't return the additional message
      const countToReturn = messages.length - 1 === amount ? amount : messages.length

      response.messages = messages.slice(0, countToReturn)

      // if we couldn't get the additional message, we'vre reached the end
      if (messages.length < amount + 1) {
        response.end = true
      }

      res.status(200).send(JSON.stringify(response)).end()
    })
    .catch(() => {
      res.status(404).end()
    })
}
