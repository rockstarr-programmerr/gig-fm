<template>
  <v-container>
    <h1>Repo: <span>{{ repo.name }}</span></h1>
    <v-divider></v-divider>
    <v-row class="mt-5">
      <v-col cols="12">
        <div class="d-flex align-items-center">
          <h2>Files changed</h2>
          <v-btn
            color="primary"
            tile
            depressed
            class="ml-5"
            @click="commitDialog = true"
          >
            Commit
          </v-btn>
        </div>
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
              :autofocus="commitDialog"
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
        <div
          v-if="funnyLoading"
          class="caption text-right px-4 pb-4"
        >
          {{ loadingText }}
        </div>
      </v-card>
    </v-dialog>
    <RepoSettings :repo="repo" />
  </v-container>
</template>

<script>
import LoadingSpinner from '@C/LoadingSpinner.vue'
import RepoSettings from './RepoSettings.vue'
import FilesChanged from './FilesChanged.vue'
import CommitHistory from './CommitHistory.vue'
import { Repo } from '@/store/repo.js'
import { mapState } from 'vuex'
import { alertSuccess, alertError } from '@/utils/message.js'
import { loadingMixin } from '@/mixins/loading.js'
import { required } from '@/utils/validate.js'
import { wait, randomChoice } from '@/utils/common.js'

export default {
  name: 'Repo',
  components: {
    FilesChanged,
    CommitHistory,
    LoadingSpinner,
    RepoSettings
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
    commitMsgRules: [required],
    funnyLoading: false,
    loadingText: '',
    initialLoadingText: 'It may take a feel minutes if your project has many large files.',
    loadingTexts: [
      "Tuning guitars...",
      "Preparing pedal boards...",
      "Where's my pick?...",
      "Warming up with arpeggios...",
      "Singer arrived late...",
      "What the hell is in your project?"
    ]
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
          this.commitMsg = ''
          this.$refs.commitHistory.resetCommits()
          this.$refs.commitForm.resetValidation()
          alertSuccess()
        })
        .catch(alertError)
        .finally(this['loading.stop'])

      this.startFunnyLoadingText()
    },
    setRepo (id) {
      const repo = this.repos.find(repo => repo.id === id)
      if (repo !== undefined) {
        this.repo = repo
      }
    },
    async startFunnyLoadingText () {
      await wait(4000)
      this.loadingText = this.initialLoadingText
      this.funnyLoading = true
      while (this.loading) {
        await wait(6000)
        this.loadingText = randomChoice(this.loadingTexts)
      }
      this.funnyLoading = false
      this.loadingText = ''
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
