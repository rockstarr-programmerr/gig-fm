<template>
  <v-app id="gig-fm">
    <NavDrawer />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavDrawer from '@C/NavDrawer.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    NavDrawer
  },
  methods: {
    ...mapActions('repo', [
      'initRepos'
    ])
  },
  mounted () {
    this.initRepos()
  }
}
</script>

<style scoped>

</style>

<style>
.gig-clickable {
  cursor: pointer;
}
</style>
