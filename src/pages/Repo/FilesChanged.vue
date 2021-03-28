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
  </div>
</template>

<script>
import { Repo } from '@/store/repo.js'
import { TreeViewBuilder } from '@/utils/tree-view-builder.js'
import { arrayEqual } from '@/utils/common.js'
import { loadingMixin } from '@/mixins/loading.js'
import LoadingSpinner from '@C/LoadingSpinner.vue'

export default {
  name: 'FilesChanged',
  props: {
    repo: {
      required: true,
      default: () => new Repo
    }
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
    deletedTreeItems: []
  }),
  computed: {
    repoClean () {
      return this.newTreeItems.length === 0 &&
             this.changedTreeItems.length === 0 &&
             this.deletedTreeItems.length === 0
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
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>
