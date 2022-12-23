import '@zapp-framework/web'
import {
  Row,
  RowConfig,
  TextConfig,
  Alignment,
  Stack,
  StackConfig,
  remember,
} from '@zapp-framework/core'
import { Message as MessageType } from 'chat-stats-common'

import { Text } from '../Text'

export function Message(message: MessageType) {
  Stack(StackConfig(`#message-${message.id}-wrapper`).padding(4), () => {
    Row(RowConfig(`#message-${message.id}`).fillWidth().alignment(Alignment.Center), () => {
      Text(TextConfig(`#message-${message.id}-user`).textSize(18), message.user.name + ':')
      Stack(StackConfig(`#message-${message.id}-spacer`).weight(1).padding(2, 6), () => {
        Text(TextConfig(`#message-${message.id}-content`).textSize(16), message.message)
      })
    })
  })
}
