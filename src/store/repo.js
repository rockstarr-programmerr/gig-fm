export class Repo {
  constructor (repo) {
    if (repo === undefined) repo = {}
    this.id = repo.id || ''
    this.name = repo.name || ''
    this.dir = repo.dir || ''
    this.defaultAuthor = repo.defaultAuthor || new Author
  }

  hasData () {
    return this.id !== ''
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
    repos: []
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
    }
  },
  actions: {
    async initRepos ({ commit }) {
      const repos = await window.api.invoke('get-repos') || []
      repos.forEach(repo => {
        repo = new Repo(repo)
        commit('addRepo', repo)
      })
    },
    createRepo ({ commit }, repo) {
      window.api.send('create-repo', repo)
      repo = new Repo(repo)
      commit('addRepo', repo)
      return repo
    },
    updateRepo ({ commit }, payload) {
      window.api.invoke('update-repo', payload)
      commit('editRepo', payload)
    }
  }
}
