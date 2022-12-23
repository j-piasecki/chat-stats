import { UserMessagesCountPerChannelQuery } from './UserMessagesCountPerChannelQuery.js'
import { UserCountInChannel } from './UserCountInChannel.js'
import { TotalEmoteCountInChannel } from './TotalEmoteCountInChannel.js'
import { SubscriberCountInChannel } from './SubscriberCountInChannel.js'

export abstract class Query {
  public static userMessagesCountPerChannelQuery() {
    return new UserMessagesCountPerChannelQuery()
  }

  public static userCountInChannel() {
    return new UserCountInChannel()
  }

  public static totalEmoteCountInChannel() {
    return new TotalEmoteCountInChannel()
  }

  public static subscriberCountInChannel() {
    return new SubscriberCountInChannel()
  }
}
