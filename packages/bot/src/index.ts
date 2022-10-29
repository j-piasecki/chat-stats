import ipc from 'node-ipc'

ipc.config.id = 'eavesdropper'
ipc.config.silent = true

ipc.serve('eavesdropper.service', () => {
  ipc.server.on('connect', () => {
    console.log('Client connected')
  })
})

ipc.server.start()

setInterval(() => {
  ipc.server.broadcast('message', { timestamp: Date.now(), message: 'Test message' })
}, 3000)
