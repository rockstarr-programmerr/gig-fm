const { app, BrowserWindow } = require('electron')
const path = require('path')
const database = require('./actions/database.js')

/**
 * Actions
 */
require('./actions/app-bar.js')
require('./actions/nav-drawer.js')
require('./actions/repo.js')
require('./actions/user-preferences.js')


function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.on('maximize', () => {
    win.webContents.send('on-window-maximized')
  })

  win.on('unmaximize', () => {
    win.webContents.send('on-window-unmaximized')
  })

  win.maximize()
  win.loadFile('dist/index.html')
  win.once('ready-to-show', () => {
    win.show()
  })
}

app.whenReady().then(async () => {
  await database.setup()
  createWindow()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await database.setup()
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
