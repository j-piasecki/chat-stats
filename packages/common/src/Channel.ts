export interface Channel {
  // Wzorzec: Identity Field
  id: string
  name: string
}

// Wzorzec: Value Object
export interface ChannelMessageCounter {
  channel: Channel
  count: number
}
