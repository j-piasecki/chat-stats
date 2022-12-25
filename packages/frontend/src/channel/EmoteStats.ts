import '@zapp-framework/web'
import {
  Zapp,
  Column,
  ColumnConfig,
  Alignment,
  TextConfig,
  Row,
  RowConfig,
  Arrangement,
} from '@zapp-framework/core'
import { Theme, Text } from '@zapp-framework/ui'
import { EmoteCounter } from 'chat-stats-common'

export function EmoteStatsView(stats: EmoteCounter[]) {
  Column(
    ColumnConfig('#emote-stats').fillWidth().background(0xff0000).padding(0, 0, 0, 64),
    () => {}
  )
}
