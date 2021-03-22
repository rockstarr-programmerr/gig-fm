const { ipcMain } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const ElectronStore = require('electron-store')


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

ipcMain.on('git-commit', async (event, dir, message) => {
  await git.add({ fs, dir, filepath: '.' }).catch(console.error)
  await git.commit({ fs, dir, message }).catch(console.error)
})

ipcMain.on('git-log', async (event, dir) => {
  const log = await git.log({ fs, dir, depth: 10 }).catch(console.error)  // TODO: how many commits to show?
  event.reply('git-log', log)
})

ipcMain.on('git-status', async (event, dir) => {
  const status = await git.statusMatrix({ fs, dir }).catch(console.error)
  event.reply('git-status', status)
})
