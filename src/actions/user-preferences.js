const { ipcMain } = require('electron')
const Store = require('electron-store')


const store = new Store()

function getDefault (obj, key, defaultVal) {
  return obj[key] !== undefined ? obj[key] : defaultVal
}

class Preferences {
  constructor (preferences) {
    if (preferences === undefined) preferences = {}
    this.darkTheme = getDefault(preferences, 'darkTheme', false)
    this.showWelcome = getDefault(preferences, 'showWelcome', true)
  }
}

ipcMain.handle('save-user-preferences', async (event, payload) => {
  const oldPreferences = store.get('user-preferences') || {}
  const newPreferences = {...oldPreferences, ...payload}
  preferences = new Preferences(newPreferences)
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

ipcMain.handle('save-appdata', async (event, key, value) => {
  store.set(key, value)
})

ipcMain.handle('get-appdata', async (event, key) => {
  return store.get(key)
})
