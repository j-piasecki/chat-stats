import '@zapp-framework/web'
import { TextConfig } from '@zapp-framework/core'
import { Text as ZappText } from '@zapp-framework/ui'

export function Text(config: ReturnType<typeof TextConfig>, text: string) {
  const bareConfig = config.build()

  if (bareConfig.textSize === undefined) {
    bareConfig.textSize = 14
  }

  ZappText(config, text)
}
