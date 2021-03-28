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
              @click="commitDialog = true"
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
        <CommitHistory :repo="repo" ref="commitHistory" />
      </v-col>
    </v-row>
    <v-dialog
      v-model="commitDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>Commit message</v-card-title>
        <v-card-text>
          <v-form ref="commitForm">
            <v-textarea
              v-model="commitMsg"
              placeholder="A detailed message will save you a lot of time later."
              autofocus
              hide-details="auto"
              :rules="commitMsgRules"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            text
            @click="commitDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            text
            width="81"
            @click="gitCommit"
          >
            <LoadingSpinner v-if="loading" />
            <span v-else>
              Commit
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import LoadingSpinner from '@C/LoadingSpinner.vue'
import FilesChanged from './FilesChanged.vue'
import CommitHistory from './CommitHistory.vue'
import { Repo } from '@/store/repo.js'
import { mapState } from 'vuex'
import { alertSuccess, alertError } from '@/utils/message.js'
import { loadingMixin } from '@/mixins/loading.js'
import { required } from '@/utils/validate.js'

export default {
  name: 'Repo',
  components: {
    FilesChanged,
    CommitHistory,
    LoadingSpinner
  },
  mixins: [
    loadingMixin
  ],
  props: {
    id: String
  },
  data: () => ({
    repo: new Repo,
    commitDialog: false,
    commitMsg: '',
    commitMsgRules: [required]
  }),
  computed: {
    ...mapState({
      repos: state => state.repo.repos
    })
  },
  methods: {
    gitCommit () {
      if (this.loading) return
      if (!this.$refs.commitForm.validate()) return
      this['loading.start']()
      window.api.invoke('git-commit', this.repo.dir, this.commitMsg)
        .then(() => {
          this.commitDialog = false
          this.$refs.commitHistory.resetCommits()
          alertSuccess()
        })
        .catch(alertError)
        .finally(this['loading.stop'])
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
