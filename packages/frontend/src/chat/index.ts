import { rememberScrollPosition } from '@zapp-framework/web'
import {
  Zapp,
  Column,
  ColumnConfig,
  Alignment,
  Arrangement,
  Stack,
  StackConfig,
  remember,
  sideEffect,
  StackAlignment,
} from '@zapp-framework/core'
import { Channel, Message as MessageType } from 'chat-stats-common'
import { Message } from './Message'
import { ActivityIndicator, ActivityIndicatorConfig } from '@zapp-framework/ui'

import config from '../config.json'

export function ChatWindow(args: { channel: Channel }) {
  Stack(StackConfig('#chat-window-wrapper').fillWidth().alignment(StackAlignment.TopCenter), () => {
    const messages = remember<MessageType[]>([])

    sideEffect(() => {
      fetch(`//${config.endpoint}/channel/${args.channel.name.substring(1)}/`)
        .then((e) => e.json())
        .then((m) => {
          messages.value = [
            ...m.messages,
            ...m.messages.map((x: any) => {
              return { ...x, id: x.id + 30 }
            }),
          ]
        })
    }, args.channel.name)

    const chatWindowConfig = ColumnConfig('#chat-window').background(0x1a1a1a)
    if (Zapp.screenWidth < 500) {
      chatWindowConfig.fillWidth()
    } else {
      chatWindowConfig.width(500)
    }

    if (messages.value.length === 0) {
      chatWindowConfig.alignment(Alignment.Center).arrangement(Arrangement.Center).fillHeight()
    }

    Column(chatWindowConfig, () => {
      const scrollPosition = rememberScrollPosition()

      if (messages.value.length > 0) {
        for (const message of messages.value) {
          Message(message)
        }
      } else {
        ActivityIndicator(ActivityIndicatorConfig('#chat-history-loading'))
      }

      const element = document.documentElement
      console.log(Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1)
    })
  })
}
