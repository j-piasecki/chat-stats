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
import { Channel as ChannelType, ChannelStats, Emote, EmoteCounter } from 'chat-stats-common'
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

export function EmotesUsedTogether(args: {
  channel: ChannelType
  stats: ChannelStats
  emote: Emote
}) {
  Stack(StackConfig('#emotes-used-together-screen-wrapper').background(0x222222).fillSize(), () => {
    const oftenUsed = remember<EmoteCounter[] | null>(null)
    const period = remember(Zapp.getValue('DATA_PERIOD') as number)
    const containerConfig = ColumnConfig('#emotes-used-together-screen').fillSize().padding(32, 0)

    if (oftenUsed.value === null) {
      containerConfig.alignment(Alignment.Center)
    }

    Column(containerConfig, () => {
      sideEffect(() => {
        oftenUsed.value = null
        fetch(
          `//${config.endpoint}/mostUsedEmoteAlong/${args.channel.name.substring(1)}/emote/${
            args.emote.id
          }?period=${period.value}d`
        )
          .then((e) => e.json())
          .then((stats) => {
            oftenUsed.value = stats.emotes
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

      ChannelStatsView(args.stats)
      Stack(
        StackConfig('#most-used-together-text-wrapper')
          .fillWidth()
          .alignment(StackAlignment.Center),
        () => {
          Text(
            TextConfig('#most-used-together-text').alignment(Alignment.Center),
            `Emotki najczęściej używane z ${args.emote.name}`
          )
        }
      )

      if (oftenUsed.value === null) {
        Stack(StackConfig('#stats-loading-wrapper').padding(64), () => {
          ActivityIndicator(ActivityIndicatorConfig('#stats-loading'))
        })
      } else {
        EmoteStatsView(
          oftenUsed.value,
          args.stats.mostUsedEmotes.find((counter) => counter.emote.id === args.emote.id)!.count
        )
      }
    })
  })
}
