<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div
      v-else-if="commits.length === 0"
      class="text-body-2 font-weight-light font-italic"
    >
      (No commits yet)
    </div>
    <v-timeline
      v-else
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
import LoadingSpinner from '@C/LoadingSpinner.vue'
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
  components: {
    LoadingSpinner,
  },
  mixins: [loadingMixin],
  data: () => ({
    commits: []
  }),
  methods: {
    async setCommits (repo) {
      this['loading.start']()

      const results = await window.api.invoke('git-log', repo.dir)
        .catch(error => {
          if (error.message.includes('NotFoundError')) {
            this.commits = []
          } else {
            console.error(error)
          }
        })
        .finally(this['loading.stop'])

      this.commits = []
      if (results === undefined) return
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
    },
    resetCommits () {  // Parent component calls this method
      this.setCommits(this.repo)
    },
    formatTimestamp
  },
  watch: {
    repo (repo) {
      if (!repo.hasData()) return
      this.setCommits(repo)
    }
  },
  mounted () {
    if (!this.repo.hasData()) return
    this.setCommits(this.repo)
  }
}
</script>

<style scoped>

</style>
