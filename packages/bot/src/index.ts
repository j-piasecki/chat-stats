import { Database } from 'chat-stats-database'
import { TwitchAuthHandler } from 'chat-stats-common'

import { Eavesdropper } from './Eavesdropper.js'
import { GameRegistry } from './GameRegistry.js'
import { EmoteExtractor } from './EmoteExtractor.js'

const extractor = new EmoteExtractor()
const gameRegistry = new GameRegistry()

await TwitchAuthHandler.acquireToken()
await Database.tryInit()

const eavesdropper = new Eavesdropper((channel, user, message) => {
  const timestamp = Date.now()

  gameRegistry.getChannelGame(user['room-id']!).then((game) => {
    Database.saveMessage(
      message,
      timestamp,
      user['room-id']!,
      channel,
      user['user-id']!,
      user.username!,
      game.id,
      game.name,
      game.thumbnailUrl,
      user.subscriber ?? false,
      user.mod ?? false,
      user.turbo ?? false,
      user['first-msg'] ?? false
    )
  })

  extractor.extractEmotes(message, user).then((emotes) => {
    Database.updateEmoteUsage(
      emotes,
      timestamp,
      user['room-id']!,
      channel,
      user['user-id']!,
      user.username!
    )
  })
})

eavesdropper.connect()
