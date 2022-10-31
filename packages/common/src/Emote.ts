export type EmoteURLS = [small: string, medium: string, large: string]

export interface Emote {
  id: string
  name: string
  animated: boolean
  urls: EmoteURLS
}

export interface EmoteCounter extends Emote {
  count: number
}
