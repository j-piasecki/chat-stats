import '@zapp-framework/web'
import {
  remember,
  Row,
  RowConfig,
  Stack,
  StackAlignment,
  StackConfig,
  TextConfig,
} from '@zapp-framework/core'
import { Text, Theme } from '@zapp-framework/ui'

const values = [30, 7, 3, 1]

export function PeriodPicker(selected: number, onChange: (selected: number) => void) {
  Row(RowConfig('#period-picker-container'), () => {
    const hovered = remember(-1)
    const pressed = remember(-1)

    for (let i = 0; i < values.length; i++) {
      const background =
        selected === values[i]
          ? 0x4e3e43
          : hovered.value === values[i]
          ? pressed.value === values[i]
            ? 0x59454b
            : 0x393133
          : 0x222222

      Stack(
        StackConfig(`#period-picker-item-${i}`)
          .alignment(StackAlignment.Center)
          .offset(values.length - i, 0)
          .background(background)
          .borderWidth(1)
          .borderColor(Theme.primary)
          .width(40)
          .height(32)
          .onPointerEnter(() => {
            hovered.value = values[i]
          })
          .onPointerLeave(() => {
            hovered.value = -1
            pressed.value = -1
          })
          .onPointerDown(() => {
            pressed.value = values[i]
          })
          .onPointerUp(() => {
            if (pressed.value === values[i]) {
              pressed.value = -1
              onChange(values[i])
            }
          }),
        () => {
          Text(TextConfig(`#period-picker-item-${i}-text`).textSize(18), `${values[i]}d`)
        }
      )
    }
  })
}
