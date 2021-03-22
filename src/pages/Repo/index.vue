<template>
  <v-container>
    <h1>Repo: <span>{{ repo.name }}</span></h1>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="6">
            <h2>Files changed</h2>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn
              color="primary"
              tile
              depressed
              @click="gitCommit"
            >
              Commit
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <FilesChanged :repo="repo" />
      </v-col>
      <v-col cols="12">
        <h2>Commit history</h2>
        <CommitHistory />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilesChanged from './FilesChanged.vue'
import CommitHistory from './CommitHistory.vue'
import { Repo } from '@/store/repo.js'
import { mapState } from 'vuex'

export default {
  name: 'Repo',
  components: {
    FilesChanged,
    CommitHistory
  },
  props: {
    id: String
  },
  data: () => ({
    repo: new Repo
  }),
  computed: {
    ...mapState({
      repos: state => state.repo.repos
    })
  },
  methods: {
    gitCommit () {
      window.api.send('git-commit', this.repo.dir, 'First commit')
    },
    setRepo (id) {
      const repo = this.repos.find(repo => repo.id === id)
      if (repo !== undefined) {
        this.repo = repo
      }
    }
  },
  mounted () {
    this.setRepo(this.id)
  },
  watch: {
    id (id) {
      this.setRepo(id)
    }
  }
}
</script>

<style scoped>

</style>
