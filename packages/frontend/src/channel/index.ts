import '@zapp-framework/web'
import {
  Navigator,
  remember,
  Row,
  RowConfig,
  sideEffect,
  Stack,
  StackConfig,
} from '@zapp-framework/core'
import { Channel as ChannelType, ChannelStats } from 'chat-stats-common'

import config from '../config.json'
import { Button, ButtonConfig } from '@zapp-framework/ui'

export function Channel(args: { channel: ChannelType }) {
  Stack(StackConfig('#channel-screen-wrapper').background(0x222222).fillSize(), () => {
    Row(RowConfig('#channel-screen').fillSize(), () => {
      const stats = remember<ChannelStats | null>(null)

      sideEffect(() => {
        fetch(`//${config.endpoint}/stats/${args.channel.name.substring(1)}/?period=7d`)
          .then((e) => e.json())
          .then((stats_: ChannelStats) => {
            stats.value = stats_
            console.log(stats_)
          })
      })

      Button(
        ButtonConfig('button').onPress(() => {
          Navigator.navigate('chat', args)
        }),
        () => {
          Stack(StackConfig('content').width(200).height(50))
        }
      )
    })
  })
}
