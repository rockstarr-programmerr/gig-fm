<template>
  <LoadingSpinner v-if="loading" />
  <div
    v-else-if="repoClean"
    class="text-body-2 font-weight-light font-italic"
  >
    (No change)
  </div>
  <div v-else>
    <div
      v-if="warning"
      class="mb-5"
    >
      <div class="error--text">
        <p>
          <v-icon color="error">mdi-exclamation-thick</v-icon>
          We detected that you changed something in your project while checking out a past version.
        <p>
          This is <strong>dangerous</strong> and can lead to <strong>corruption</strong> of your project. <br>
          Please undo your changes immediately, you must go back to the latest version to make changes.
        </p>
        <p>
          Remember the rule when time travelling: <strong>Don't alter the past!</strong>
        </p>
      </div>
      <div>
        <v-btn
          color="error"
          tile
          depressed
          @click="restoreConfirm = true"
        >
          Undo changes
        </v-btn>
      </div>
    </div>
    <div
      v-if="newTreeItems.length > 0"
      class="mb-3"
    >
      <h3>New files</h3>
      <v-treeview
        :items="newTreeItems"
        dense
        activatable
        hoverable
        open-on-click
        transition
        color="secondary"
      >
        <template #prepend="{ item, open }">
          <v-icon v-if="!item.isFile">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-file-outline
        </v-icon>
        </template>
      </v-treeview>
    </div>
    <div
      v-if="changedTreeItems.length > 0"
      class="mb-3"
    >
      <h3>Changed files</h3>
      <v-treeview
        :items="changedTreeItems"
        dense
        activatable
        hoverable
        open-on-click
        transition
        color="secondary"
      >
        <template #prepend="{ item, open }">
          <v-icon v-if="!item.isFile">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-file-outline
        </v-icon>
        </template>
      </v-treeview>
    </div>
    <div
      v-if="deletedTreeItems.length > 0"
      class="mb-3"
    >
      <h3>Deleted files</h3>
      <v-treeview
        :items="deletedTreeItems"
        dense
        activatable
        hoverable
        open-on-click
        transition
        color="secondary"
      >
        <template #prepend="{ item, open }">
          <v-icon v-if="!item.isFile">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          mdi-file-outline
        </v-icon>
        </template>
      </v-treeview>
    </div>
    <v-dialog
      v-model="restoreConfirm"
      max-width="500"
      eager
    >
      <v-card>
        <v-card-title>
          Confirm undo changes
        </v-card-title>
        <v-card-text>
          This will undo current changes made in every file of your project. <br>
          If any change matters to you, note them down somewhere first before confirming.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            text
            @click="restoreConfirm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            text
            width="94"
            @click="gitRestore"
          >
            <LoadingSpinner v-if="restoring" />
            <span v-else>
              Confirm
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Repo } from '@/store/repo.js'
import { TreeViewBuilder } from '@/utils/tree-view-builder.js'
import { arrayEqual } from '@/utils/common.js'
import { loadingMixin } from '@/mixins/loading.js'
import { alertSuccess, alertError } from '@/utils/message.js'
import LoadingSpinner from '@C/LoadingSpinner.vue'

export default {
  name: 'FilesChanged',
  emits: ['git-restore'],
  props: {
    repo: {
      required: true,
      default: () => new Repo
    },
    isLatestCommit: Boolean
  },
  components: {
    LoadingSpinner
  },
  mixins: [loadingMixin],
  data: () => ({
    interval: undefined,
    newFiles: [],
    changedFiles: [],
    deletedFiles: [],
    newTreeItems: [],
    changedTreeItems: [],
    deletedTreeItems: [],
    restoreConfirm: false,
    restoring: false
  }),
  computed: {
    repoClean () {
      return this.newTreeItems.length === 0 &&
             this.changedTreeItems.length === 0 &&
             this.deletedTreeItems.length === 0
    },
    warning () {
      return !this.isLatestCommit && !this.repoClean
    }
  },
  methods: {
    startWatchingStatus (repo) {
      window.api.receive('git-status', (results) => {
        this.newFiles = []
        this.changedFiles = []
        this.deletedFiles = []
        if (results === undefined) return

        const FILE = 0, ABSENT = 0, HEAD = 1, WORKDIR = 2, STAGE = 3

        const isNewFile = row => row[HEAD] === ABSENT && row[WORKDIR] !== ABSENT
        const isChangedFile = row => row[HEAD] !== ABSENT && row[WORKDIR] !== ABSENT && row[WORKDIR] !== row[HEAD]
        const isDeletedFile = row => row[HEAD] !== ABSENT && row[WORKDIR] === ABSENT

        results.forEach(result => {
          if (isNewFile(result)) this.newFiles.push(result[FILE])
          if (isChangedFile(result)) this.changedFiles.push(result[FILE])
          if (isDeletedFile(result)) this.deletedFiles.push(result[FILE])
        })

        this['loading.stop']()
      })

      clearInterval(this.interval)
      this.interval = window.setInterval(() => {
        window.api.send('git-status', repo.dir)
      }, 1000)
    },
    gitRestore () {
      this.restoring = true

      const promises = [
        window.api.invoke('remove-files', this.newFiles, this.repo.dir),
        window.api.invoke('git-restore', this.repo.dir, 'master')
      ]

      Promise.all(promises)
        .then(() => {
          alertSuccess()
          this.$emit('git-restore')
        })
        .catch(alertError)
        .finally(() => {
          this.restoring = false
          this.restoreConfirm = false
        })
    }
  },
  watch: {
    repo (repo) {
      if (!repo.hasData()) return
      this['loading.start']()
      this.startWatchingStatus(repo)
    },
    newFiles (val, oldVal) {
      if (arrayEqual(val, oldVal)) return
      this['loading.start']()
      const builder = new TreeViewBuilder(val)
      this.newTreeItems = builder.build()
      this['loading.stop']()
    },
    changedFiles (val, oldVal) {
      if (arrayEqual(val, oldVal)) return
      this['loading.start']()
      const builder = new TreeViewBuilder(val)
      this.changedTreeItems = builder.build()
      this['loading.stop']()
    },
    deletedFiles (val, oldVal) {
      if (arrayEqual(val, oldVal)) return
      this['loading.start']()
      const builder = new TreeViewBuilder(val)
      this.deletedTreeItems = builder.build()
      this['loading.stop']()
    },
  },
  mounted () {
    this['loading.start']()
    this.startWatchingStatus(this.repo)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>
