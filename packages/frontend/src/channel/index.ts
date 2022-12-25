import '@zapp-framework/web'
import {
  Alignment,
  Column,
  ColumnConfig,
  Navigator,
  remember,
  Row,
  RowConfig,
  sideEffect,
  Stack,
  StackAlignment,
  StackConfig,
  TextConfig,
} from '@zapp-framework/core'
import { Channel as ChannelType, ChannelStats, EmoteCounter } from 'chat-stats-common'
import {
  ActivityIndicator,
  ActivityIndicatorConfig,
  Button,
  ButtonConfig,
  Text,
} from '@zapp-framework/ui'

import config from '../config.json'
import { ChannelStatsView } from './ChannelStats'
import { EmoteStatsView } from './EmoteStats'

export function Channel(args: { channel: ChannelType }) {
  Stack(StackConfig('#channel-screen-wrapper').background(0x222222).fillSize(), () => {
    const stats = remember<ChannelStats | null>(null)
    const containerConfig = ColumnConfig('#channel-screen').fillSize().padding(32, 0)

    if (stats.value === null) {
      containerConfig.alignment(Alignment.Center)
    }

    Column(containerConfig, () => {
      sideEffect(() => {
        fetch(`//${config.endpoint}/stats/${args.channel.name.substring(1)}/?period=7d`)
          .then((e) => e.json())
          .then((stats_: ChannelStats) => {
            stats.value = stats_
            console.log(stats_)
          })
      })

      Stack(StackConfig('#channel-header').fillWidth(), () => {
        Stack(
          StackConfig('#channel-name-container')
            .fillWidth()
            .padding(32, 0)
            .alignment(StackAlignment.Center),
          () => {
            Text(TextConfig('#channel-name'), args.channel.name.substring(1))
          }
        )
        Stack(
          StackConfig('#channel-actions-container').fillWidth().alignment(StackAlignment.TopEnd),
          () => {
            Button(
              ButtonConfig('button').onPress(() => {
                Navigator.navigate('chat', args)
              }),
              () => {
                Text(TextConfig('#chat-text').textSize(12), 'Chat')
              }
            )
          }
        )
      })

      if (stats.value === null) {
        Stack(StackConfig('#stats-loading-wrapper').padding(64), () => {
          ActivityIndicator(ActivityIndicatorConfig('#stats-loading'))
        })
      } else {
        ChannelStatsView(stats.value!)
        EmoteStatsView(stats.value!.mostUsedemotes)
      }
    })
  })
}
