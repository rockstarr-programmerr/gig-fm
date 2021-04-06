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
        v-for="(commit, index) of paginatedCommits"
        :key="commit.id"
        small
        :color="index % 2 === 0 ? 'primary' : 'secondary'"
      >
        <v-row
          class="commit-row"
          :class="[
            currentTheme,
            { 'commit-row--active': commit.id === currentCommitId }
          ]"
        >
          <v-col cols="3">
            <p class="mb-0 text-body-2">
              {{ formatTimestamp(commit.timestamp) }}
            </p>
          </v-col>
          <v-col cols="9">
            <div class="d-flex justify-space-between">
              <div class="pr-3">
                <p class="mb-0 text-body-1 gig-preserve-whitespace">{{ commit.message }}</p>
                <p class="caption font-weight-light">{{ commit.author.name }} ({{ commit.author.email }})</p>
              </div>
              <div class="commit-actions">
                <v-menu
                  nudge-bottom="38"
                  left
                >
                  <template #activator="{ attrs, on }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                  </template>
                  <v-list dense>
                    <v-list-item
                      @click="checkout(commit.id)"
                      :disabled="commit.id === currentCommitId"
                    >
                      <v-list-item-content>
                        <v-list-item-title>Checkout</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="confirmReset(commit)"
                      :disabled="commit.id === firstCommitId"
                    >
                      <v-list-item-content>
                        <v-list-item-title>Reset to this commit</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-if="commit.id === firstCommitId && currentCommitId === firstCommitId"
                      @click="changeMsgDialog = true"
                    >
                      <v-list-item-content>
                        <v-list-item-title>Change message</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
    <v-pagination
      v-if="pageCount > 1"
      v-model="page"
      :length="pageCount"
      :total-visible="7"
      class="mb-7"
    ></v-pagination>
    <v-dialog
      v-model="confirmResetDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>Confirm reset</v-card-title>
        <v-card-text>
          <p>
            By resetting to a past version, you <strong>lose</strong> all versions after it.
            This action is <strong>irreversible!</strong>
            Please confirm this is what you really want.
          </p>
          <p>
            You should know the difference between <strong>reset</strong> and <strong>checkout</strong>.
          </p>
          <p>
            Commit you're resetting to:
          </p>
          <blockquote class="blockquote gig-preserve-whitespace">{{ commitToReset.message }}</blockquote>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            text
            @click="confirmResetDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            text
            width="94"
            @click="gitReset"
          >
            <LoadingSpinner v-if="loading" />
            <span v-else>
              Confirm
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="changeMsgDialog"
      width="500"
    >
      <v-card>
        <v-card-title>
          Change commit message
        </v-card-title>
        <v-card-text>
          <v-form ref="changeMsgForm">
            <v-textarea
              v-model="newMsg"
              placeholder="You can only change message of the newest and unpublished commit."
              :autofocus="changeMsgDialog"
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
            @click="changeMsgDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            text
            @click="changeMessage"
          >
            <LoadingSpinner v-if="loading" />
            <span v-else>
              Change
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LoadingSpinner from '@C/LoadingSpinner.vue'
import { Repo, Commit, Author } from '@/store/repo.js'
import { loadingMixin } from '@/mixins/loading.js'
import { formatTimestamp } from '@/utils/format.js'
import { alertSuccess, alertError } from '@/utils/message.js'
import { required } from '@/utils/validate.js'

export default {
  name: 'CommitHistory',
  inject: ['theme'],
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
    commits: [],
    currentCommitId: '',
    commitToReset: {},
    confirmResetDialog: false,
    page: 1,
    perPage: 10,
    changeMsgDialog: false,
    newMsg: '',
    commitMsgRules: [required]
  }),
  computed: {
    paginatedCommits () {
      const startIndex = (this.page - 1) * this.perPage
      const endIndex = startIndex + 10
      return this.commits.slice(startIndex, endIndex + 1)
    },
    pageCount () {
      return Math.ceil(this.commits.length / this.perPage)
    },
    currentTheme () {
      const theme = this.theme.isDark ? 'dark' : 'light'
      return `theme--${theme}`
    },
    firstCommitId () {
      const firstCommit = this.commits[0]
      if (firstCommit !== undefined) {
        return firstCommit.id
      } else {
        return ''
      }
    }
  },
  methods: {
    formatTimestamp,
    async setCommits (repo) {
      this['loading.start']()

      // NOTE: Version 1.0.0 only support 1 branch, so we fix branch name as 'master' here
      // Later versions will need to find out how to get this branch name if they were to
      // support multiple branches
      const results = await window.api.invoke('git-log', repo.dir, 'master')

      this.commits = []
      if (results === undefined) {
        this['loading.stop']()
        return
      }
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

      this.setCurrentCommit()
      this['loading.stop']()
    },
    resetCommits () {  // Parent component calls this method
      this.setCommits(this.repo)
    },
    async setCurrentCommit () {
      // Which commit is HEAD currently at?
      this.currentCommitId = await window.api.invoke('git-resolve-ref', this.repo.dir)
    },
    checkout (commitId) {
      const isFirstCommit = commitId === this.firstCommitId
      const ref = isFirstCommit ? 'master' : commitId

      window.api.invoke('git-checkout', this.repo.dir, ref)
        .then(() => {
          alertSuccess()
          this.setCurrentCommit()
        })
        .catch(alertError)
    },
    changeMessage () {
      if (!this.$refs.changeMsgForm.validate()) return
      this['loading.start']()
      window.api.invoke('git-change-message', this.repo.dir, this.newMsg, 'master')
        .then(() => {
          alertSuccess()
          this.changeMsgDialog = false
          this.newMsg = ''
          this.setCommits(this.repo)
          this.$refs.changeMsgForm.resetValidation()
        })
        .catch(alertError)
        .finally(this['loading.stop'])
    },
    confirmReset (commit) {
      this.commitToReset = commit
      this.confirmResetDialog = true
    },
    gitReset () {
      this['loading.start']()
      window.api.invoke('git-reset-hard', this.repo.dir, this.commitToReset.id, 'master')
        .then(() => {
          alertSuccess()
          this.confirmResetDialog = false
          this.commitToReset = {}
          this.setCommits(this.repo)
        })
        .catch(alertError)
        .finally(this['loading.stop'])
    }
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

<style scoped lang="scss">
@import 'vuetify/src/styles/styles.sass';

$override-states: (
  'states': (
    'focus': 0.08,
    'activated': 0.08
  )
);
$material-light: map-deep-merge($material-light, $override-states);
$material-dark: map-deep-merge($material-dark, $override-states);

@include theme(commit-row) using ($material) {
  @include states($material)
};

$hover-padding: -12px;

.commit-row {
  user-select: none;

  &:before {
    background-color: currentColor;
    bottom: $hover-padding;
    left: $hover-padding;
    right: $hover-padding;
    top: $hover-padding;
    content: '';
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: $primary-transition;
  }
}

.commit-actions {
  width: 30px;
}
</style>
