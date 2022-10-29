import ipc from 'node-ipc'
import tmi from 'tmi.js'
import fs from 'fs'

const listenOn = JSON.parse(fs.readFileSync('channels.json', 'utf-8'))

ipc.config.id = 'eavesdropper'
ipc.config.silent = true

ipc.serve('eavesdropper.service', () => {
  ipc.server.on('connect', () => {
    console.log('Client connected')
  })
})

ipc.server.start()

let messages = 0

const client = new tmi.client({
  connection: {
    reconnect: true,
  },
  channels: listenOn.channels,
})

client.on('message', (channel, user, msg) => {
  ipc.server.broadcast('message', {
    channel: channel,
    user: user,
    message: msg,
  })

  messages++
})

client.on('connected', (addr, port) => {
  console.log(`Connected to ${addr}:${port}`)

  setInterval(() => {
    console.log(
      `Status: ${client.readyState()}, listening on: ${client.getChannels().length} channels, ${
        messages / 5
      } m/s`
    )
    messages = 0
  }, 5000)
})

client.connect().catch((e) => {
  console.log("Couldn't connect to Twitch", e)
})
