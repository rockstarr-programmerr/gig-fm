const { ipcMain } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const ElectronStore = require('electron-store')


ipcMain.on('git-commit', async (event, dir, message) => {
  await git.add({ fs, dir, filepath: '.' })
  await git.commit({ fs, dir, message })
})

ipcMain.on('git-log', async (event, dir) => {
  const log = await git.log({ fs, dir, depth: 10 })  // TODO: how many commits to show?
  event.reply('git-log', log)
})

ipcMain.on('get-repos', (event) => {
  const store = new ElectronStore
  const repos = store.get('repos') || []
  event.reply('get-repos', repos)
})

ipcMain.on('create-repo', (event, repo) => {
  const store = new ElectronStore
  const repos = store.get('repos') || []
  repos.splice(0, 0, repo)
  store.set('repos', repos)
})
