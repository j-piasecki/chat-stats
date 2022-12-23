import { registerNavigationRoutes } from '@zapp-framework/web'

import { Stack, StackConfig, Zapp } from '@zapp-framework/core'

Zapp.startLoop()

function Home() {
  Stack(StackConfig('root').fillSize().background(0xff0000))
}

registerNavigationRoutes('home', {
  home: Home,
})
