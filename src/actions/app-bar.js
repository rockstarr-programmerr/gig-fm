const { ipcMain, BrowserWindow } = require('electron')


ipcMain.handle('window-close', () => {
  const win = BrowserWindow.getFocusedWindow()
  win.close()
})

ipcMain.handle('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win.minimize()
})

ipcMain.handle('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win.maximize()
})

ipcMain.handle('window-unmaximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win.unmaximize()
})
