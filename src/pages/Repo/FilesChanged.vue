<template>
  <div>
    <div>
      New files:
      <ul>
        <li
          v-for="file of newFiles"
          :key="file"
        >
          {{ file }}
        </li>
      </ul>
    </div>
    <div>
      Changed files:
      <ul>
        <li
          v-for="file of changedFiles"
          :key="file"
        >
          {{ file }}
        </li>
      </ul>
    </div>
    <div>
      Deleted files:
      <ul>
        <li
          v-for="file of deletedFiles"
          :key="file"
        >
          {{ file }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Repo } from '@/store/repo.js'

export default {
  name: 'FilesChanged',
  props: {
    repo: {
      required: true,
      default: () => new Repo
    }
  },
  data: () => ({
    interval: undefined,
    newFiles: [],
    changedFiles: [],
    deletedFiles: []
  }),
  mounted () {
    window.api.receive('git-status', (results) => {
      this.newFiles = []
      this.changedFiles = []
      this.deletedFiles = []

      const FILE = 0, ABSENT = 0, HEAD = 1, WORKDIR = 2, STAGE = 3

      const isNewFile = row => row[HEAD] === ABSENT && row[WORKDIR] !== ABSENT
      const isChangedFile = row => row[HEAD] !== ABSENT && row[WORKDIR] !== ABSENT && row[WORKDIR] !== row[HEAD]
      const isDeletedFile = row => row[HEAD] !== ABSENT && row[WORKDIR] === ABSENT

      results.forEach(result => {
        if (isNewFile(result)) this.newFiles.push(result[FILE])
        if (isChangedFile(result)) this.changedFiles.push(result[FILE])
        if (isDeletedFile(result)) this.deletedFiles.push(result[FILE])
      })
    })

    this.interval = window.setInterval(() => {
      window.api.send('git-status', this.repo.dir)
    }, 2000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>

</style>
