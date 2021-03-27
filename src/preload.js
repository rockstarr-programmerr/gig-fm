const { contextBridge, ipcRenderer } = require('electron')

const validChanels = [
  'add-new-repo',
  'get-repos',
  'create-repo',
  'git-commit',
  'git-log',
  'git-status',
  'window-close',
  'window-minimize',
  'window-maximize',
  'window-unmaximize',
  'on-window-maximized',
  'on-window-unmaximized'
]

contextBridge.exposeInMainWorld(
  'api', {
    send (channel, ...args) {
      if (validChanels.includes(channel)) {
        ipcRenderer.send(channel, ...args)
      }
    },
    invoke (channel, ...args) {
      if (validChanels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args)
      }
    },
    receive (channel, func) {
      if (validChanels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)
