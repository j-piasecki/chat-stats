import { registerNavigationRoutes } from '@zapp-framework/web'

import { Row, RowConfig, Zapp, remember, sideEffect } from '@zapp-framework/core'
import { ChatWindow } from './chat/ChatWindow'

import config from './config.json'
import { Message } from 'chat-stats-common'

Zapp.startLoop()

function Home() {
  Row(RowConfig('root').fillSize().background(0xff0000), () => {
    const messages = remember<Message[]>([])

    sideEffect(() => {
      fetch(`http://${config.endpoint}/channel/test/`)
        .then((e) => e.json())
        .then((m) => {
          messages.value = [
            ...m.messages,
            ...m.messages.map((x) => {
              return { ...x, id: x.id + 30 }
            }),
          ]
        })
    })

    Row(RowConfig('info').weight(1))

    ChatWindow(messages.value)
  })
}

registerNavigationRoutes('home', {
  home: Home,
})
