<template>
  <v-navigation-drawer
    app
    permanent
    clipped
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title
          @click="goHome"
          class="gig-clickable"
        >
          Home
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-menu
          right
          nudge-bottom="38"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
            >
              mdi-dots-vertical
            </v-icon>
          </template>
          <v-list dense>
            <v-list-item
              link
              :to="{ name: 'RepoList' }"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Your repos
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon small>mdi-source-branch</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item
              link
              :to="{ name: 'Settings' }"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Settings
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon small>mdi-settings-outline</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item
              link
              :to="{ name: 'Help' }"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Help
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-action>
    </v-list-item>
    <v-list-item>
      <v-btn
        color="primary"
        tile
        depressed
        block
        @click="addNewRepo"
      >
        New repo
      </v-btn>
    </v-list-item>
    <v-list-group
      :value="true"
    >
      <template v-slot:activator>
        <v-list-item-title>
          My repos
        </v-list-item-title>
      </template>
      <v-list-item
        v-for="repo of repos"
        :key="repo.id"
        link
        :to="{ name: 'Repo', params: { id: repo.id } }"
      >
        <v-list-item-content>
          <v-list-item-title>{{ repo.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="noRepo"
        class="text-body-2 font-weight-light font-italic"
      >
        (Nothing yet)
      </v-list-item>
    </v-list-group>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { alertError } from '@/utils/message.js'

export default {
  name: 'NavDrawerLeft',
  computed: {
    ...mapState({
      repos: state => state.repo.repos
    }),
    noRepo () {
      return this.repos.length === 0
    }
  },
  methods: {
    ...mapActions('repo', [
      'createRepo'
    ]),
    addNewRepo () {
      window.api.send('add-new-repo')
      window.api.receive('add-new-repo', async repo => {
        if (repo === undefined) return
        this.createRepo(repo)
          .then(lastId => {
            this.$router.push({ name: 'Repo', params: { id: lastId } })
          })
          .catch(errorCode => {
            if (errorCode === 'REPO_EXISTS') {
              alertError("You've already created this repo.")
            } else {
              alertError()
            }
          })
      })
    },
    goHome () {
      if (this.$route.name !== 'Home') {
        this.$router.push({ name: 'Home' })
      }
    }
  },
}
</script>

<style scoped>

</style>
