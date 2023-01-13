import { registerNavigationRoutes } from '@zapp-framework/web'
import { Zapp } from '@zapp-framework/core'

import { Home } from './HomeScreen'
import { Channel } from './channel'
import { ChatWindow } from './chat'
import { EmotesUsedTogether } from './channel/EmotesUsedTogether'

// Wzorzec: Application Controller
// Wzorzec: Client Session State
Zapp.startLoop()
Zapp.setValue('DATA_PERIOD', 3)

registerNavigationRoutes('home', {
  home: Home,
  channel: Channel,
  chat: ChatWindow,
  emotesUsedTogether: EmotesUsedTogether,
})
