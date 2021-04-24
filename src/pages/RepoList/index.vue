<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <h1>Your repos</h1>
      <div class="search-box">
        <v-text-field
          v-model="searchText"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details
          outlined
          dense
          clearable
        ></v-text-field>
      </div>
    </div>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item
            v-for="(repo, index) of filteredRepos"
            :key="repo.id"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ index + 1 }}.
                {{ repo.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-icon
                  @click="$router.push({
                    name: 'Repo',
                    params: { id: repo.id }
                  })"
                >
                  mdi-arrow-right-bold-hexagon-outline
                </v-icon>
                <v-icon
                  class="ml-1"
                  @click="openDeleteConfirmDialog(repo)"
                >
                  mdi-delete-outline
                </v-icon>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <span
          v-if="filteredRepos.length === 0"
          class="font-weight-light font-italic"
        >
          (No repo)
        </span>
      </v-col>
    </v-row>
    <v-dialog
      v-model="deleteConfirm"
      max-width="500"
      eager
    >
      <v-card>
        <v-card-title>
          Confirm delete repo
        </v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete <strong>{{ repoToDelete.name }}</strong> repo?</p>
          <p>
            Your version history will be lost, but your project <strong>will not be deleted</strong>.
          </p>
          <p>
            If you don't need to track versions anymore, deleting a repo can save some disk space.
          </p>
          <p>
            <span class="warning--text">Warning!</span>
            If you delete a repo while checking out a past version, you'll stuck there forever.
            Please make sure you've checked out to the latest version first.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            text
            @click="deleteConfirm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            text
            width="81"
            @click="executeDeleteRepo"
          >
            <LoadingSpinner v-if="loading" />
            <span v-else>
              Confirm
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import LoadingSpinner from '@C/LoadingSpinner.vue'
import { mapState, mapActions } from 'vuex'
import { Repo } from '@/store/repo.js'
import { loadingMixin } from '@/mixins/loading.js'
import { alertSuccess, alertError } from '@/utils/message.js'

export default {
  name: 'RepoList',
  components: {
    LoadingSpinner
  },
  mixins: [
    loadingMixin
  ],
  data: () => ({
    deleteConfirm: false,
    repoToDelete: new Repo,
    searchText: ''
  }),
  computed: {
    ...mapState({
      repos: state => state.repo.repos
    }),
    filteredRepos () {
      // Using input's clear icon change searchText to null
      if (this.searchText === '' || this.searchText === null || this.searchText === undefined) {
        return this.repos
      } else {
        return this.repos.filter(repo => repo.name.includes(this.searchText))
      }
    }
  },
  methods: {
    ...mapActions('repo', [
      'deleteRepo'
    ]),
    openDeleteConfirmDialog (repo) {
      this.repoToDelete = repo
      this.deleteConfirm = true
    },
    executeDeleteRepo () {
      this['loading.start']()
      this.deleteRepo(this.repoToDelete)
        .then(alertSuccess)
        .catch(alertError)
        .finally(() => {
          this['loading.stop']()
          this.deleteConfirm = false
        })
    }
  }
}
</script>

<style scoped>
.search-box {
  width: 300px;
}
</style>
