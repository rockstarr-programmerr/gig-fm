const { ipcMain, dialog } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


ipcMain.on('add-new-repo', (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] })
    .then(async result => {
      let dir = undefined

      if (!result.canceled) {
        dir = result.filePaths[0]
        await git.init({ fs, dir })
        await git.setConfig({ fs, dir,  // TODO
          path: 'user.name',
          value: 'rockstar-programmer'
        })
        await git.setConfig({ fs, dir,  // TODO
          path: 'user.email',
          value: 'rockstarrprogrammerr@gmail.com'
        })
      }

      const id = uuidv4()  // unique id for the new repo
      const name = path.basename(dir)
      event.reply('add-new-repo', { id, dir, name })
    })
    .catch(console.error)
})
