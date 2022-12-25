import '@zapp-framework/web'
import {
  Column,
  ColumnConfig,
  remember,
  sideEffect,
  Alignment,
  Arrangement,
  Stack,
  StackConfig,
  TextConfig,
  Navigator,
} from '@zapp-framework/core'
import { ActivityIndicator, ActivityIndicatorConfig, Text } from '@zapp-framework/ui'

import apiConfig from './config.json'
import { Channel as ChannelType } from 'chat-stats-common'

function Channel(channel: ChannelType) {
  Stack(StackConfig(`#channel-${channel.id}-wrapper`), () => {
    const hovered = remember(false)
    const pressed = remember(false)

    Stack(
      StackConfig(`#channel-${channel.id}`)
        .onPointerEnter(() => {
          hovered.value = true
        })
        .onPointerLeave(() => {
          hovered.value = false
          pressed.value = false
        })
        .onPointerDown(() => {
          pressed.value = true
        })
        .onPointerUp(() => {
          if (pressed.value) {
            hovered.value = false
            pressed.value = false
            Navigator.navigate('channel', {
              channel: channel,
            })
          }
        })
        .background(hovered.value ? (pressed.value ? 0x444444 : 0x333333) : 0x222222)
        .padding(8, 32),
      () => {
        Text(TextConfig(`#channel-${channel.id}-text`), channel.name)
      }
    )
  })
}

export function Home() {
  Stack(StackConfig('#home-screen-wrapper').background(0x222222), () => {
    const channels = remember<ChannelType[] | null>(null)
    const config = ColumnConfig('#home-screen').fillWidth().alignment(Alignment.Center)

    if (channels.value !== null) {
      config.padding(64, 0)
    } else {
      config.arrangement(Arrangement.Center).fillHeight()
    }

    Column(config, () => {
      sideEffect(() => {
        fetch(`//${apiConfig.endpoint}/trackedChannels/`)
          .then((e) => e.json())
          .then((m) => {
            channels.value = m.channels
          })
      })

      if (channels.value !== null) {
        for (const channel of channels.value) {
          Channel(channel)
        }
      } else {
        ActivityIndicator(ActivityIndicatorConfig('#loading-channels'))
      }
    })
  })
}
