const path = require('path')
const fs = require('fs')
const util = require('util')
const { ipcMain, shell } = require('electron')


ipcMain.handle('remove-files', async (event, filePaths, basePath) => {
  if (basePath !== undefined) {
    filePaths = filePaths.map(filePath => path.join(basePath, filePath))
  }

  const unlink = util.promisify(fs.unlink)
  const promises = filePaths.map(path => unlink(path))

  await Promise.all(promises)
})

ipcMain.handle('open-in-explorer', async (event, fullPath) => {
  shell.openPath(fullPath)
})
