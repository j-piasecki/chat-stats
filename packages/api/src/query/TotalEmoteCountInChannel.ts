import { Database } from 'chat-stats-database'
import { QueryObject } from './QueryObject.js'

export function isTotalEmoteCountInChannel<T>(
  query: QueryObject<T>
  // @ts-ignore ts thinks it knows better, it doesn't
  // the types may be wrong, but thats exactly what this function checks
): query is TotalEmoteCountInChannel {
  return query.type === TotalEmoteCountInChannel.TYPE
}

export class TotalEmoteCountInChannel extends QueryObject<number> {
  static TYPE = 'TotalEmoteCountInChannel'
  readonly type: string = TotalEmoteCountInChannel.TYPE

  private _channel: string
  private _startTimestamp: number
  private _endTimestamp: number
  private _period: number

  get channel() {
    return this._channel
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

  async execute(): Promise<number> {
    if (this._channel === undefined) {
      throw 'Insufficient data to perform the query: channel is undefined'
    }

    if (this._startTimestamp === undefined) {
      throw 'Insufficient data to perform the query: start timestamp is undefined'
    }

    if (this._endTimestamp === undefined) {
      throw 'Insufficient data to perform the query: end timestamp is undefined'
    }

    return await Database.getTotalEmoteCountInChannel(
      this._channel,
      this._startTimestamp,
      this._endTimestamp
    )
  }
}
