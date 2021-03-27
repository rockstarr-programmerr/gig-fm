<template>
  <div>
    <ul>
      <li
        v-for="commit of commits"
        :key="commit.id"
        class="mb-3"
      >
        <p class="mb-0">Message: {{ commit.message }}</p>
        <p class="mb-0">Author: {{ commit.author.name }} ({{ commit.author.email }})</p>
        <p class="mb-0">Time: {{ new Date(commit.timestamp) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { Repo, Commit, Author } from '@/store/repo.js'
import { loadingMixin } from '@/mixins/loading.js'

export default {
  name: 'CommitHistory',
  props: {
    repo: {
      required: true,
      default: () => new Repo
    }
  },
  mixins: [loadingMixin],
  data: () => ({
    commits: []
  }),
  methods: {
    setCommits (repo) {
      if (this.loading) return
      this['loading.start']
      window.api.invoke('git-log', repo.dir)
        .then(results => {
          console.log(results)
          this.commits = []
          results.forEach(result => {
            const author = new Author({
              name: result.commit.author.name,
              email: result.commit.author.email,
            })
            const commit = new Commit({
              id: result.oid,
              author,
              message: result.commit.message,
              timestamp: result.commit.author.timestamp,
            })
            this.commits.push(commit)
          })
        })
        .catch(console.error)
        .finally(this['loading.stop'])
    },
    resetCommits () {  // Parent component calls this method
      this.setCommits(this.repo)
    }
  },
  watch: {
    repo (repo) {
      this.setCommits(repo)
    }
  },
  mounted () {
    this.setCommits(this.repo)
  }
}
</script>

<style scoped>

</style>
