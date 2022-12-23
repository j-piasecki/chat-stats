import { UserMessagesCountPerChannelQuery } from './UserMessagesCountPerChannelQuery.js'
import { UserCountInChannel } from './UserCountInChannel.js'
import { TotalEmoteCountInChannel } from './TotalEmoteCountInChannel.js'
import { SubscriberCountInChannel } from './SubscriberCountInChannel.js'
import { MostUsedEmotesInChannel } from './MostUsedEmotesInChannel.js'
import { MessageCountInChannel } from './MessageCountInChannel.js'
import { FirstTimerCountInChannel } from './FirstTimerCountInChannel.js'

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

  public static mostUsedEmotesInChannel() {
    return new MostUsedEmotesInChannel()
  }

  public static messageCountInChannel() {
    return new MessageCountInChannel()
  }

  public static firstTimerCountInChannel() {
    return new FirstTimerCountInChannel()
  }
}
