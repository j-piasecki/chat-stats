export type EmoteURLS = [small: string, medium: string, large: string]

export interface Emote {
  // Wzoerzec: Identity Field
  id: string
  name: string
  animated: boolean
  urls: EmoteURLS
}

// Wzorzec: Value Object
export interface EmoteCounter {
  emote: Emote
  count: number
}
