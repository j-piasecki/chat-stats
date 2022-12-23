import { ChannelMessageCounter } from 'chat-stats-common'
import { Database } from 'chat-stats-database'
import { QueryObject } from './QueryObject.js'

export function isUserMessagesCountPerChannelQuery<T>(
  query: QueryObject<T>
  // @ts-ignore ts thinks it knows better, it doesn't
  // the types may be wrong, but thats exactly what this function checks
): query is UserMessagesCountPerChannelQuery {
  return query.type === UserMessagesCountPerChannelQuery.TYPE
}

export class UserMessagesCountPerChannelQuery extends QueryObject<ChannelMessageCounter[]> {
  static TYPE = 'UserMessagesCountPerChannelQuery'
  readonly type: string = UserMessagesCountPerChannelQuery.TYPE

  private _user: string
  private _startTimestamp: number
  private _endTimestamp: number
  private _period: number

  get user() {
    return this._user
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

  forUser(user: string) {
    this._user = user
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

  async execute(): Promise<ChannelMessageCounter[]> {
    if (this._user === undefined) {
      throw 'Insufficient data to perform the query: user is undefined'
    }

    if (this._startTimestamp === undefined) {
      throw 'Insufficient data to perform the query: start timestamp is undefined'
    }

    if (this._endTimestamp === undefined) {
      throw 'Insufficient data to perform the query: end timestamp is undefined'
    }

    return await Database.getUserMessagesCountPerChannel(
      this._user,
      this._startTimestamp,
      this._endTimestamp
    )
  }
}
