import { EmoteCounter } from 'chat-stats-common'
import { Database } from 'chat-stats-database'
import { QueryObject } from './QueryObject.js'

export function isEmotesMostOftenUsedAlongInChannel<T>(
  query: QueryObject<T>
  // @ts-ignore ts thinks it knows better, it doesn't
  // the types may be wrong, but thats exactly what this function checks
): query is EmotesMostOftenUsedAlongInChannel {
  return query.type === EmotesMostOftenUsedAlongInChannel.TYPE
}

export class EmotesMostOftenUsedAlongInChannel extends QueryObject<EmoteCounter[]> {
  static TYPE = 'EmotesMostOftenUsedAlongInChannel'
  readonly type: string = EmotesMostOftenUsedAlongInChannel.TYPE

  private _channel: string
  private _emoteId: string
  private _startTimestamp: number
  private _endTimestamp: number
  private _period: number

  get channel() {
    return this._channel
  }

  get emoteId() {
    return this._emoteId
  }

  get startTimestamp() {
    return this._startTimestamp
  }

  get endTimestamp() {
    return this._endTimestamp
  }

  get period() {
    return this._period
  }

  forChannel(channel: string) {
    this._channel = channel
    return this
  }

  forEmote(emoteId: string) {
    this._emoteId = emoteId
    return this
  }

  before(endTimestamp: number) {
    this._endTimestamp = endTimestamp
    return this
  }

  after(startTimestamp: number) {
    this._startTimestamp = startTimestamp
    return this
  }

  forPeriod(period: number) {
    this._period = period
    return this
  }

  async execute(): Promise<EmoteCounter[]> {
    if (this._channel === undefined) {
      throw 'Insufficient data to perform the query: channel is undefined'
    }

    if (this._emoteId === undefined) {
      throw 'Insufficient data to perform the query: emote id is undefined'
    }

    if (this._startTimestamp === undefined) {
      throw 'Insufficient data to perform the query: start timestamp is undefined'
    }

    if (this._endTimestamp === undefined) {
      throw 'Insufficient data to perform the query: end timestamp is undefined'
    }

    return await Database.getEmotesMostOftenUsedAlongInChannel(
      this._channel,
      this.emoteId,
      this._startTimestamp,
      this._endTimestamp
    )
  }
}
