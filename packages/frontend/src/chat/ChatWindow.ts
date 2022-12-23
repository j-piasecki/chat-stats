import { rememberScrollPosition } from '@zapp-framework/web'
import { Zapp, Column, ColumnConfig } from '@zapp-framework/core'
import { Message as MessageType } from 'chat-stats-common'
import { Message } from './Message'

export function ChatWindow(messages: MessageType[]) {
  const chatWindowConfig = ColumnConfig('#chat-window').background(0x002200)
  if (Zapp.screenWidth < 500) {
    chatWindowConfig.fillWidth()
  } else {
    chatWindowConfig.width(500)
  }

  Column(chatWindowConfig, () => {
    const a = rememberScrollPosition()
    for (const message of messages) {
      Message(message)
    }

    const element = document.documentElement
    console.log(Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1)
  })
}
