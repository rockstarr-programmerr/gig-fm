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
  // Here, we cannot do a simple "git add -A" and then "git commit". This is isomorphic-git's issue.
  // The author said: "For now though, the quickest way to implement a "git add -A"
  // would probably be to run statusMatrix and then loop through the results
  // and run git.add on all the files with changes."
  // Reference: https://github.com/isomorphic-git/isomorphic-git/issues/715
  const statuses = await git.statusMatrix({ fs, dir }).catch(console.error)
  const promises = statuses.map(status => {
    const [filepath, , WorkdirStatus, ] = [...status]
    if (WorkdirStatus) {
      return git.add({ fs, dir, filepath })
    } else {
      return git.remove({ fs, dir, filepath })
    }
  }).filter(promise => promise !== undefined)

  Promise.all(promises)
    .then(() => {
      git.commit({ fs, dir, message }).catch(console.error)
    })
    .catch(console.error)
})

ipcMain.on('git-log', async (event, dir) => {
  const log = await git.log({ fs, dir, depth: 10 }).catch(console.error)  // TODO: how many commits to show?
  event.reply('git-log', log)
})

ipcMain.on('git-status', async (event, dir) => {
  const status = await git.statusMatrix({ fs, dir }).catch(console.error)
  event.reply('git-status', status)
})
