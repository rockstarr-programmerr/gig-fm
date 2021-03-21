<template>
  <v-navigation-drawer
    app
    permanent
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
      <v-list-item v-if="noRepo">Nothing yet</v-list-item>
    </v-list-group>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'NavDrawer',
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
      window.api.receive('add-new-repo', repo => {
        if (repo === undefined) return
        this.createRepo(repo)
      })
      window.api.send('add-new-repo')
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
