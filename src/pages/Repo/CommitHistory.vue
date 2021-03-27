<template>
  <div>
    <v-timeline
      dense
      align-top
    >
      <v-timeline-item
        v-for="(commit, index) of commits"
        :key="commit.id"
        small
        :color="index % 2 === 0 ? 'primary' : 'secondary'"
      >
        <v-row>
          <v-col cols="3">
            <p class="mb-0 text-body-2">
              {{ formatTimestamp(commit.timestamp) }}
            </p>
          </v-col>
          <v-col cols="9">
            <p class="mb-0 text-body-1 gig-preserve-whitespace">{{ commit.message }}</p>
            <p class="caption font-weight-light">{{ commit.author.name }} ({{ commit.author.email }})</p>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { Repo, Commit, Author } from '@/store/repo.js'
import { loadingMixin } from '@/mixins/loading.js'
import { formatTimestamp } from '@/utils/format.js'

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
    },
    formatTimestamp
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
