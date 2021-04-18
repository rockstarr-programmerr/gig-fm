const { ipcMain, dialog } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const path = require('path')


ipcMain.on('add-new-repo', (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] })
    .then(async result => {
      if (result.canceled) return

      const dir = result.filePaths[0]
      await git.init({ fs, dir })

      const name = path.basename(dir)
      event.reply('add-new-repo', { dir, name })
    })
    .catch(console.error)
})
