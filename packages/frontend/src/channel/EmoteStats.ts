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
  Image,
  ImageConfig,
  Stack,
  StackConfig,
  StackAlignment,
  remember,
  Color,
} from '@zapp-framework/core'
import { Theme, Text } from '@zapp-framework/ui'
import { Emote, EmoteCounter } from 'chat-stats-common'

const barColors = [0xcc4444, 0xaa44aa, 0x4444aa, 0x44aaaa, 0x44aa44, 0xaaaa44]

function EmoteRow(
  counter: EmoteCounter,
  mostUsed: number,
  total: number,
  background: number,
  onPress?: (emote: Emote) => void
) {
  Stack(
    StackConfig(`#emote-row-${counter.emote.id}-wrapper`)
      .height(48)
      .fillWidth()
      .alignment(StackAlignment.CenterStart),
    () => {
      const hovered = remember(false)
      const pressed = remember(false)

      Stack(
        StackConfig(`#emote-row-${counter.emote.id}-wrapper`)
          .height(48)
          .fillWidth()
          .alignment(StackAlignment.CenterStart)
          .background(
            hovered.value
              ? pressed.value
                ? Color.accent(0x222222, 0.1)
                : Color.accent(0x222222, 0.05)
              : 0x222222
          )
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
              pressed.value = false

              onPress?.(counter.emote)
            }
          }),
        () => {
          Row(
            RowConfig(`#emote-row-${counter.emote.id}`)
              .height(48)
              .background(
                hovered.value
                  ? pressed.value
                    ? Color.accent(background, 0.2)
                    : Color.accent(background, 0.1)
                  : background
              )
              .fillWidth(counter.count / mostUsed)
              .alignment(Alignment.Center)
              .padding(8, 0, 0, 0),
            () => {
              Image(
                ImageConfig(`#emote-row-${counter.emote.id}-image`).width(64).height(32),
                counter.emote.urls[0]
              )

              Text(
                TextConfig(`#emote-row-${counter.emote.id}-name`).textSize(18),
                counter.emote.name
              )
            }
          )

          Row(
            RowConfig(`#emote-row-${counter.emote.id}-usage`)
              .fillWidth()
              .arrangement(Arrangement.End)
              .padding(0, 0, 8, 0),
            () => {
              Text(
                TextConfig(`#emote-row-${counter.emote.id}-usage-text`)
                  .textSize(14)
                  .textColor(Theme.onPrimaryContainer),
                `${counter.count} (${((counter.count / total) * 100).toFixed(2)}%)`
              )
            }
          )
        }
      )
    }
  )
}

export function EmoteStatsView(
  stats: EmoteCounter[],
  totalCount: number,
  clickHandler?: (emote: Emote) => void
) {
  const padding = Zapp.screenWidth >= 600 ? Zapp.screenWidth * 0.1 : 8

  if (stats.length > 0) {
    const mostUsed = stats[0].count

    Column(ColumnConfig('#emote-stats').fillWidth().padding(padding, 0, padding, 64), () => {
      for (let i = 0; i < stats.length; i++) {
        EmoteRow(stats[i], mostUsed, totalCount, barColors[i % barColors.length], clickHandler)
      }
    })
  } else {
    Row(
      RowConfig('#emote-stats')
        .fillWidth()
        .padding(padding, 64, padding, 64)
        .arrangement(Arrangement.Center)
        .alignment(Alignment.Center),
      () => {
        Text(TextConfig('#emote-no-stats').textSize(30), 'Nie ma emotek')
        Image(
          ImageConfig('#emote-no-stats-image').width(32).height(32).offset(8, -4),
          './sadge.png'
        )
      }
    )
  }
}
