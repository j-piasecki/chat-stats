import { registerNavigationRoutes } from '@zapp-framework/web'
import { Zapp } from '@zapp-framework/core'

import { Home } from './HomeScreen'
import { Channel } from './channel'
import { ChatWindow } from './chat'
import { EmotesUsedTogether } from './channel/EmotesUsedTogether'

Zapp.startLoop()

registerNavigationRoutes('home', {
  home: Home,
  channel: Channel,
  chat: ChatWindow,
  emotesUsedTogether: EmotesUsedTogether,
})
