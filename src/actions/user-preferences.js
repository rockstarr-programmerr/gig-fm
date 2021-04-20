const { ipcMain } = require('electron')
const Store = require('electron-store')


const store = new Store()

class Preferences {
  constructor (preferences) {
    if (preferences === undefined) preferences = {}
    this.darkTheme = preferences.darkTheme || false
  }
}

ipcMain.handle('save-user-preferences', async (event, preferences) => {
  preferences = new Preferences(preferences)
  store.set('user-preferences', preferences)
})

ipcMain.handle('get-user-preferences', async () => {
  const preferences = store.get('user-preferences')
  if (preferences === undefined) {
    return new Preferences
  } else {
    return new Preferences(preferences)
  }
})
