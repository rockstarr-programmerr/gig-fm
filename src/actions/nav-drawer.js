const { ipcMain, dialog } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


ipcMain.on('add-new-repo', (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] })
    .then(async result => {
      if (result.canceled) return

      const dir = result.filePaths[0]
      await git.init({ fs, dir })

      const id = uuidv4()  // unique id for the new repo
      const name = path.basename(dir)
      event.reply('add-new-repo', { id, dir, name })
    })
    .catch(console.error)
})
