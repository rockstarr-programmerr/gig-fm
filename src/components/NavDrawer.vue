<template>
  <v-navigation-drawer
    app
    permanent
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>GigFM</v-list-item-title>
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
        v-for="(repo, index) of repos"
        :key="index"
      >

      </v-list-item>
      <v-list-item v-if="noRepo">Nothing yet</v-list-item>
    </v-list-group>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavDrawer',
  data: () => ({
    repos: []
  }),
  computed: {
    noRepo () {
      return this.repos.length === 0
    }
  },
  methods: {
    addNewRepo () {
      window.api.receive('add-new-repo', result => {
        console.log(result)
      })
      window.api.send('add-new-repo')
    }
  }
}
</script>

<style scoped>

</style>
