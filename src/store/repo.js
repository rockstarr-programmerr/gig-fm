export class Repo {
  constructor (repo) {
    if (repo === undefined) repo = {}
    this.id = repo.id || ''
    this.name = repo.name || ''
    this.dir = repo.dir || ''
  }
}

export class Author {
  constructor (author) {
    if (author === undefined) author = {}
    this.name = author.name || ''
    this.email = author.email || ''
  }
}

export class History {
  constructor (history) {
    if (history === undefined) history = {}
    this.message = history.message || ''
    this.author = history.author || new Author
    this.timestamp = history.timestamp || null
  }
}

export default {
  namespaced: true,
  state: () => ({
    repos: []
  }),
  mutations: {
    addRepo (state, repo) {
      state.repos.splice(0, 0, repo)
    }
  },
  actions: {
    initRepos ({ commit }) {
      window.api.receive('get-repos', repos => {
        repos.forEach(repo => {
          commit('addRepo', repo)
        })
      })
      window.api.send('get-repos')
    },
    createRepo ({ commit }, repo) {
      window.api.send('create-repo', repo)
      commit('addRepo', repo)
    }
  }
}
