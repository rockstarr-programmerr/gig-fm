const { ipcMain, dialog } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
// const http = require('isomorphic-git/http/node')


ipcMain.on('add-new-repo', (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] })
    .then(result => {
      if (result.canceled) return
      const dir = result.filePaths[0]
      git.init({ fs, dir })
    })
    .catch(console.error)
})
