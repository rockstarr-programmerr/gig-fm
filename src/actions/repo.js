const { ipcMain } = require('electron')
const git = require('isomorphic-git')
const fs = require('fs')
const path = require('path')
const database = require('./database.js')


ipcMain.on('get-repos', (event) => {
  database.getAllRepos()
    .then(rows => {
      event.reply('get-repos', true, rows)
    })
    .catch(error => {
      event.reply('get-repos', false)
      console.error(error)
    })
})

ipcMain.on('create-repo', (event, repo) => {
  database.createRepo(repo.name, repo.dir)
    .then(lastID => {
      event.reply('create-repo', true, lastID)
    })
    .catch(error => {
      event.reply('create-repo', false)
      console.error(error)
    })
})

ipcMain.on('update-repo', (event, payload) => {
  database.updateRepo(
    payload.id,
    payload.repoName,
    payload.authorName,
    payload.authorEmail
  )
    .then(() => {
      event.reply('update-repo', true)
    })
    .catch(error => {
      event.reply('create-repo', false)
      console.error(error)
    })
})

ipcMain.handle('git-commit', async (event, dir, message, authorName, authorEmail) => {
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
  await git.commit({
    fs, dir, message,
    author: {
      name: authorName,
      email: authorEmail
    }
  })
})

ipcMain.handle('git-log', async (event, dir, ref) => {
  if (ref === undefined) ref = 'HEAD'
  const log = await git.log({ fs, dir, ref }).catch(error => {
    if (error.code === 'NotFoundError') return
    throw error
  })
  return log
})

ipcMain.on('git-status', async (event, dir) => {
  const status = await git.statusMatrix({ fs, dir }).catch(console.error)
  event.reply('git-status', status)
})

ipcMain.handle('git-checkout', async (event, dir, ref) => {
  const result = await git.checkout({ fs, dir, ref })
  return result
})

ipcMain.handle('git-resolve-ref', async (event, dir, ref) => {
  if (ref === undefined) ref = 'HEAD'
  const result = await git.resolveRef({ fs, dir, ref })
  return result
})

ipcMain.handle('git-reset-hard', async (event, dir, commitId, branchName) => {
  const headDir = path.resolve(dir, `.git/refs/heads/${branchName}`)
  const indexDir = path.resolve(dir, `.git/index`)
  fs.writeFileSync(headDir, commitId)
  fs.unlinkSync(indexDir)
  await git.checkout({ fs, dir, ref: branchName, force: true })
})

ipcMain.handle('git-change-message', async (event, dir, newMessage, branchName) => {
  const headRef = await git.resolveRef({ fs, dir, ref: 'HEAD' })
  const oldCommitObj = await git.readCommit({ fs, dir, oid: headRef })
  const commit = oldCommitObj.commit
  commit.message = newMessage
  const newCommitObjOid = await git.writeCommit({ fs, dir, commit })
  const headDir = path.resolve(dir, `.git/refs/heads/${branchName}`)
  fs.writeFileSync(headDir, newCommitObjOid)
})

ipcMain.handle('git-restore', async (event, dir, branchName) => {
  const result = await git.checkout({ fs, dir, ref: branchName, force: true })
  return result
})
