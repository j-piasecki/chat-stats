import tmi from 'tmi.js'
import fs from 'fs'

type MessageCallbackType = (channel: string, user: tmi.ChatUserstate, message: string) => void

export class Eavesdropper {
  private channelsToListen: string[]
  private chatClient: tmi.Client
  private messageCounter: number
  private messageCallback: MessageCallbackType

  constructor(onMessage: MessageCallbackType) {
    this.messageCounter = 0
    this.messageCallback = onMessage
    this.channelsToListen = JSON.parse(fs.readFileSync('channels.json', 'utf-8')).channels
    this.chatClient = new tmi.client({
      connection: {
        reconnect: true,
      },
      channels: this.channelsToListen,
    })
  }

  private logStatus() {
    console.log(
      `Status: ${this.chatClient.readyState()}, listening on: ${
        this.chatClient.getChannels().length
      } channels, ${this.messageCounter / 10} m/s`
    )

    this.messageCounter = 0
  }

  public connect() {
    this.chatClient.on('message', (channel, user, msg) => {
      this.messageCallback?.(channel, user, msg)

      this.messageCounter++
    })

    this.chatClient.on('connected', (addr, port) => {
      console.log(`Connected to ${addr}:${port}`)

      this.logStatus()
      setInterval(() => {
        this.logStatus()
      }, 10000)
    })

    this.chatClient.connect().catch((e) => {
      console.log("Couldn't connect to Twitch", e)
    })
  }
}
