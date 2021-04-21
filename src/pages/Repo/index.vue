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
            :disabled="!enableCommit"
            @click="commitDialog = true"
          >
            Commit
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12">
        <FilesChanged
          :repo="repo"
          :is-latest-commit="isLatestCommit"
          @git-restore="onGitRestore"
        />
      </v-col>
      <v-col cols="12">
        <h2>Commit history</h2>
        <CommitHistory
          ref="commitHistory"
          :repo="repo"
          @latest-commit-updated="onLatestCommitUpdated"
        />
      </v-col>
    </v-row>
    <v-dialog
      v-model="commitDialog"
      max-width="500"
      eager
    >
      <v-card>
        <v-card-title>Commit message</v-card-title>
        <v-card-text>
          <v-form ref="commitForm">
            <v-textarea
              v-model="commitMsg"
              placeholder="A detailed message will save you a lot of time later."
              :autofocus="commitDialog"
              :rules="[required]"
            ></v-textarea>
            <div
              v-if="!repo.hasDefaultAuthor()"
              class="mt-5"
            >
              <v-icon class="mr-1">mdi-information-outline</v-icon>
              <span>
                Finish setup in the right sidebar so that
                you don't have to enter the below information everytime.
              </span>
            </div>
            <v-text-field
              v-model="committerName"
              label="Your name"
              :rules="[required]"
            ></v-text-field>
            <v-text-field
              v-model="committerEmail"
              label="Your email"
              :rules="[required, validEmail]"
              validate-on-blur
            ></v-text-field>
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
import { required, validEmail } from '@/utils/validate.js'
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
    id: [String, Number]
  },
  data: () => ({
    commitDialog: false,
    commitMsg: '',
    committerName: '',
    committerEmail: '',
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
    ],
    enableCommit: true,
    isLatestCommit: true
  }),
  computed: {
    ...mapState({
      repos: state => state.repo.repos
    }),
    repo () {
      // Here, we must use 2 equals instead of 3 equals
      // because this.id is String (get from url params) while repo.id is Number (get from DB)
      return this.repos.find(repo => repo.id == this.id) || new Repo
    }
  },
  methods: {
    required,
    validEmail,
    gitCommit () {
      if (this.loading) return
      if (!this.$refs.commitForm.validate()) return
      this['loading.start']()
      window.api.invoke('git-commit', this.repo.dir, this.commitMsg, this.committerName, this.committerEmail)
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
    },
    onLatestCommitUpdated (isLatestCommit) {
      this.isLatestCommit = isLatestCommit
      this.enableCommit = isLatestCommit
    },
    onGitRestore () {
      this.$refs.commitHistory.setCurrentCommit()
    }
  },
  watch: {
    'repo.defaultAuthor': {
      deep: true,
      handler (author) {
        this.committerName = author.name
        this.committerEmail = author.email
      }
    },
    commitDialog () {
      this.$refs.commitForm.resetValidation()
    }
  },
  mounted () {
    this.committerName = this.repo.defaultAuthor.name
    this.committerEmail = this.repo.defaultAuthor.email
  }
}
</script>

<style scoped>

</style>
