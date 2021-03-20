<template>
  <v-app id="gig-fm">
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
      class="app-bar"
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <router-link :to="{ name: 'Home' }" class="white--text">
          Home
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>

</style>
