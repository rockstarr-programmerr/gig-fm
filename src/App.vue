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

export default {
  name: 'App',
  components: {
    NavDrawer
  }
}
</script>

<style scoped>

</style>
