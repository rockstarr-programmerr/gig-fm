const { contextBridge, ipcRenderer } = require('electron')

const validChanels = [
  'add-new-repo',
  'get-repos',
  'create-repo',
  'window-close',
  'window-minimize',
  'window-maximize',
  'window-unmaximize',
  'on-window-maximized',
  'on-window-unmaximized',
  'git-commit',
  'git-log',
  'git-status',
  'git-checkout',
  'git-resolve-ref'
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
