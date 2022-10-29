import ipc from 'node-ipc'

import { TwitchEmoteProvider } from './emotes/TwitchEmoteProvider.js'
import { BTTVEmoteProvider } from './emotes/BTTVEmoteProvider.js'
import { SevenTVEmoteProvider } from './emotes/SevenTVEmoteProvider.js'

// const provider = new SevenTVEmoteProvider()

// provider.getGlobalEmotes().then((data) => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// provider.getChannelEmotes('57361005').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

ipc.config.silent = true

ipc.connectTo('eavesdropper', 'eavesdropper.service', () => {
  ipc.of.eavesdropper.on('message', (data) => {
    console.log(data)
  })
})
