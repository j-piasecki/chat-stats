export interface Channel {
  id: string
  name: string
}

export interface ChannelMessageCounter {
  channel: Channel
  count: number
}
