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

export function EmotesUsedTogether(args: {
  channel: ChannelType
  stats: ChannelStats
  emote: Emote
}) {
  Stack(StackConfig('#emotes-used-together-screen-wrapper').background(0x222222).fillSize(), () => {
    const oftenUsed = remember<EmoteCounter[] | null>(null)
    const containerConfig = ColumnConfig('#emotes-used-together-screen').fillSize().padding(32, 0)

    if (oftenUsed.value === null) {
      containerConfig.alignment(Alignment.Center)
    }

    Column(containerConfig, () => {
      sideEffect(() => {
        fetch(
          `//${config.endpoint}/mostUsedEmoteAlong/${args.channel.name.substring(1)}/emote/${
            args.emote.id
          }?period=7d`
        )
          .then((e) => e.json())
          .then((stats) => {
            oftenUsed.value = stats.emotes
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
