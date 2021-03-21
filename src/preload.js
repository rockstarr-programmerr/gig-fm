const { contextBridge, ipcRenderer } = require("electron")


contextBridge.exposeInMainWorld(
  'api', {
    send (channel, data) {
      const validChanels = ['add-new-repo']
      if (validChanels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    receive (channel, func) {
      const validChanels = ['add-new-repo']
      if (validChanels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)
