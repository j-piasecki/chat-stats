import { Database } from 'chat-stats-database'
import { QueryObject } from './QueryObject.js'

export function isMessageCountInChannel<T>(
  query: QueryObject<T>
  // @ts-ignore ts thinks it knows better, it doesn't
  // the types may be wrong, but thats exactly what this function checks
): query is MessageCountInChannel {
  return query.type === MessageCountInChannel.TYPE
}

export class MessageCountInChannel extends QueryObject<number> {
  static TYPE = 'MessageCountInChannel'
  readonly type: string = MessageCountInChannel.TYPE

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

    return await Database.getMessageCountInChannel(
      this._channel,
      this._startTimestamp,
      this._endTimestamp
    )
  }
}
