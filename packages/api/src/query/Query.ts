import { UserMessagesCountPerChannelQuery } from './UserMessagesCountPerChannelQuery.js'

export abstract class Query {
  public static userMessagesCountPerChannelQuery() {
    return new UserMessagesCountPerChannelQuery()
  }
}
