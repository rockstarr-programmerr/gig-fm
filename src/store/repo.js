export class Repo {
  constructor (repo) {
    if (repo === undefined) repo = {}
    this.id = repo.id || null
    this.name = repo.name || ''
    this.dir = repo.dir || ''
    this.defaultAuthor = repo.defaultAuthor || new Author
  }

  hasData () {
    return this.id !== null
  }

  hasDefaultAuthor () {
    return this.defaultAuthor.name !== '' &&
           this.defaultAuthor.email !== ''
  }
}

export class Author {
  constructor (author) {
    if (author === undefined) author = {}
    this.name = author.name || ''
    this.email = author.email || ''
  }
}

export class Commit {
  constructor (commit) {
    if (commit === undefined) commit = {}
    this.id = commit.id || ''
    this.message = commit.message || ''
    this.author = commit.author || new Author
    this.timestamp = commit.timestamp || null
  }
}

export default {
  namespaced: true,
  state: () => ({
    repos: [],
    gettingRepos: false,
    creatingRepo: false,
    updatingRepo: false,
    deletingRepo: false
  }),
  mutations: {
    addRepo (state, repo) {
      state.repos.splice(0, 0, repo)
    },
    editRepo (state, payload) {
      const { id, repoName, authorName, authorEmail } = payload
      const repo = state.repos.find(repo => repo.id === id)
      if (repo === undefined) return

      repo.name = repoName || repo.name
      repo.defaultAuthor.name = authorName || repo.defaultAuthor.name
      repo.defaultAuthor.email = authorEmail || repo.defaultAuthor.email
    },
    removeRepo (state, id) {
      state.repos = state.repos.filter(repo => repo.id !== id)
    },
    setGettingRepos (state, status) {
      state.gettingRepos = status
    },
    setCreatingRepo (state, status) {
      state.creatingRepo = status
    },
    setUpdatingRepo (state, status) {
      state.updatingRepo = status
    },
    setDeletingRepo (state, status) {
      state.deletingRepo = status
    }
  },
  actions: {
    initRepos ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('setGettingRepos', true)

        window.api.send('get-repos') || []
        window.api.receive('get-repos', (isSuccess, results) => {
          if (isSuccess) {
            results.forEach(result => {
              const author = new Author({
                name: result.author_name,
                email: result.author_email
              })
              const repo = new Repo({
                id: result.id,
                name: result.name,
                dir: result.dir,
                defaultAuthor: author
              })
              commit('addRepo', repo)
            })
            resolve()
          } else {
            reject()
          }

          commit('setGettingRepos', false)
        })
      })
    },

    createRepo ({ commit }, repo) {
      return new Promise((resolve, reject) => {
        commit('setCreatingRepo', true)

        window.api.send('create-repo', repo)
        window.api.receive('create-repo', (isSuccess, payload) => {
          if (isSuccess) {
            repo.id = payload  // In this case, `payload` is the created ID
            repo = new Repo(repo)
            commit('addRepo', repo)
            resolve(payload)
          } else {
            reject(payload)  // In this case, `payload` is the error code
          }

          commit('setCreatingRepo', false)
        })
      })
    },

    updateRepo ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setUpdatingRepo', true)

        window.api.send('update-repo', payload)
        window.api.receive('update-repo', (isSuccess) => {
          if (isSuccess) {
            commit('editRepo', payload)
            resolve()
          } else {
            reject()
          }

          commit('setUpdatingRepo', false)
        })
      })
    },

    deleteRepo ({ commit }, repo) {
      return new Promise((resolve, reject) => {
        commit('setDeletingRepo', true)

        window.api.invoke('delete-repo', repo)
          .then(() => {
            commit('removeRepo', repo.id)
            resolve()
          })
          .catch(() => {
            reject()
          })
          .finally(() => {
            commit('setDeletingRepo', false)
          })
      })
    }
  }
}
