const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipc: {
    get(channel, payload) {
      return ipcRenderer.sendSync(channel, payload)
    },
    send(channel, payload) {
      ipcRenderer.send(channel, payload)
    },
    on(channel, callback) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args))
    },
    once(channel, callback) {
      ipcRenderer.once(channel, (event, ...args) => callback(...args))
    },
    off(channel, callback) {
      ipcRenderer.off(channel, callback)
    },
  },
})
