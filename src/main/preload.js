const { contextBridge, ipcRenderer } = require('electron')
const { STORE_SET, STORE_SET } = require('../ipc/channels')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping')
    },
    on(channel, func) {
      const validChannels = ['ipc-example']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args))
      }
    },
  },
  store: {
    get(value) {
      return ipcRenderer.sendSync(STORE_GET, value)
    },
    set(key, value) {
      ipcRenderer.send(STORE_SET, key, value)
    },
  },
})
