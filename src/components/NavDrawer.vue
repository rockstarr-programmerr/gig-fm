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
          GigFM
        </v-list-item-title>
      </v-list-item-content>
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
          Your repos
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
          .catch(alertError)
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
