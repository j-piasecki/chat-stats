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
import { ChannelStats } from 'chat-stats-common'

function DisplayStat(name: string, value: number) {
  if (Zapp.screenWidth >= 768 || Zapp.screenWidth < 280) {
    Column(ColumnConfig(`#stat-${name}`).alignment(Alignment.Center), () => {
      Text(TextConfig(`#stat-${name}-text`).textSize(16), name)
      Text(TextConfig(`#stat-${name}-value`).textSize(30).textColor(Theme.primary), `${value}`)
    })
  } else {
    Row(
      RowConfig(`#stat-${name}`)
        .alignment(Alignment.Center)
        .fillWidth()
        .arrangement(Arrangement.SpaceBetween),
      () => {
        Text(TextConfig(`#stat-${name}-text`).textSize(18), `${name}:`)
        Text(TextConfig(`#stat-${name}-value`).textSize(30).textColor(Theme.primary), `${value}`)
      }
    )
  }
}

export function ChannelStatsView(stats: ChannelStats) {
  if (Zapp.screenWidth >= 768) {
    Row(
      RowConfig('#channel-stats-container')
        .fillWidth()
        .arrangement(Arrangement.SpaceAround)
        .padding(0, 32, 0, 40),
      () => {
        DisplayStat('Nowi widzowie', stats.firstTimersCount)
        DisplayStat('Liczba wiadomości', stats.messageCount)
        DisplayStat('Liczba subów', stats.subscriberCount)
        DisplayStat('Użyte emotki', stats.totalEmoteCount)
        DisplayStat('Unikatowi widzowie', stats.userCount)
      }
    )
  } else {
    Column(
      ColumnConfig('#channel-stats-container')
        .fillWidth()
        .arrangement(Arrangement.SpaceAround)
        .alignment(Zapp.screenWidth < 280 ? Alignment.Center : Alignment.Start)
        .padding(Zapp.screenWidth * 0.08, 24, Zapp.screenWidth * 0.08, 24),
      () => {
        DisplayStat('Nowi widzowie', stats.firstTimersCount)
        DisplayStat('Liczba wiadomości', stats.messageCount)
        DisplayStat('Liczba subów', stats.subscriberCount)
        DisplayStat('Użyte emotki', stats.totalEmoteCount)
        DisplayStat('Unikatowi widzowie', stats.userCount)
      }
    )
  }
}
