import '@zapp-framework/web'
import {
  Alignment,
  Arrangement,
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
  Zapp,
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
import { PeriodPicker } from './PeriodPicker'

export function Channel(args: { channel: ChannelType }) {
  Stack(StackConfig('#channel-screen-wrapper').background(0x222222).fillSize(), () => {
    const stats = remember<ChannelStats | null>(null)
    const period = remember(0)
    period.value = Zapp.getValue('DATA_PERIOD') as number

    const containerConfig = ColumnConfig('#channel-screen').fillSize().padding(32, 0)

    if (stats.value === null) {
      containerConfig.alignment(Alignment.Center)
    }

    Column(containerConfig, () => {
      sideEffect(() => {
        stats.value = null
        fetch(
          `//${config.endpoint}/stats/${args.channel.name.substring(1)}/?period=${period.value}d`
        )
          .then((e) => e.json())
          .then((stats_: ChannelStats) => {
            stats.value = stats_
          })
      }, period.value)

      Stack(StackConfig('#channel-header').fillWidth().alignment(StackAlignment.Center), () => {
        Stack(
          StackConfig('#channel-name-container')
            .fillWidth()
            .padding(Zapp.screenWidth > 550 ? 0 : 48, 32, 0, 32)
            .alignment(Zapp.screenWidth > 550 ? StackAlignment.Center : StackAlignment.CenterStart),
          () => {
            Text(TextConfig('#channel-name'), args.channel.name.substring(1))
          }
        )

        Stack(
          StackConfig('#channel-actions-container').fillWidth().alignment(StackAlignment.CenterEnd),
          () => {
            Column(
              ColumnConfig('test')
                .height(100)
                .padding(0, 0, 8, 0)
                .arrangement(Arrangement.SpaceBetween)
                .alignment(Alignment.End),
              () => {
                Button(
                  ButtonConfig('button').onPress(() => {
                    Navigator.navigate('chat', args)
                  }),
                  () => {
                    Text(TextConfig('#chat-text').textSize(12), 'Chat')
                  }
                )

                PeriodPicker(period.value, (selected) => {
                  Zapp.setValue('DATA_PERIOD', selected)
                  period.value = selected
                })
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
        EmoteStatsView(stats.value!.mostUsedEmotes, stats.value!.totalEmoteCount, (emote) => {
          Navigator.navigate('emotesUsedTogether', {
            channel: args.channel,
            stats: stats.value!,
            emote: emote,
          })
        })
      }
    })
  })
}
