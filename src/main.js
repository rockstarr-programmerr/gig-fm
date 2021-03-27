const { app, BrowserWindow } = require('electron')
const path = require('path')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
})

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.maximize()
  win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Actions
 */
require('./actions/nav-drawer.js')
require('./actions/repo.js')
