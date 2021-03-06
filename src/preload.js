const { contextBridge, ipcRenderer } = require('electron')

const validChanels = [
  'add-new-repo',
  'get-repos',
  'create-repo',
  'update-repo',
  'window-close',
  'window-minimize',
  'window-maximize',
  'window-unmaximize',
  'on-window-maximized',
  'on-window-unmaximized',
  'save-user-preferences',
  'get-user-preferences',
  'remove-files',
  'delete-repo',
  'save-appdata',
  'get-appdata',
  'open-in-explorer',
  'git-commit',
  'git-log',
  'git-status',
  'git-checkout',
  'git-resolve-ref',
  'git-reset-hard',
  'git-change-message',
  'git-restore',
  'git-restore-deleted-file'
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
    },
    receiveOnce (channel, func) {
      if (validChanels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(...args))
      }
    }
  }
)
