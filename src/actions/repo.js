const { ipcMain } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const ElectronStore = require('electron-store')


ipcMain.handle('get-repos', async () => {
  const store = new ElectronStore
  const repos = store.get('repos') || []
  return repos
})

ipcMain.on('create-repo', (event, repo) => {
  const store = new ElectronStore
  const repos = store.get('repos') || []
  repos.splice(0, 0, repo)
  store.set('repos', repos)
})

ipcMain.handle('git-commit', async (event, dir, message) => {
  // Here, we cannot do a simple "git add -A" and then "git commit". This is isomorphic-git's issue.
  // The author said: "For now though, the quickest way to implement a "git add -A"
  // would probably be to run statusMatrix and then loop through the results
  // and run git.add on all the files with changes."
  // Reference: https://github.com/isomorphic-git/isomorphic-git/issues/715
  const statuses = await git.statusMatrix({ fs, dir })
  const promises = statuses.map(status => {
    const [filepath, , WorkdirStatus, ] = [...status]
    if (WorkdirStatus) {
      return git.add({ fs, dir, filepath })
    } else {
      return git.remove({ fs, dir, filepath })
    }
  }).filter(promise => promise !== undefined)

  await Promise.all(promises)
  await git.commit({ fs, dir, message })
})

ipcMain.handle('git-log', async (event, dir) => {
  const log = await git.log({ fs, dir }).catch(error => {
    if (error.code === 'NotFoundError') return
    throw error
  })
  return log
})

ipcMain.on('git-status', async (event, dir) => {
  const status = await git.statusMatrix({ fs, dir }).catch(console.error)
  event.reply('git-status', status)
})
