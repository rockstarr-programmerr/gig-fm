const { contextBridge, ipcRenderer } = require("electron")

const validChanels = [
  'add-new-repo',
  'get-repos',
  'create-repo',
  'git-commit',
  'git-log'
]

contextBridge.exposeInMainWorld(
  'api', {
    send (channel, ...args) {
      if (validChanels.includes(channel)) {
        ipcRenderer.send(channel, ...args)
      }
    },
    receive (channel, func) {
      if (validChanels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)
