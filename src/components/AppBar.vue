<template>
  <v-app-bar
    app
    clipped-left
    flat
    height="30"
  >
    <v-spacer></v-spacer>
    <v-icon>mdi-window-minimize</v-icon>
    <!-- <v-icon>mdi-window-maximize</v-icon> -->
    <v-icon>mdi-window-restore</v-icon>
    <v-icon>mdi-window-close</v-icon>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar'
}
</script>

<style scoped>

</style>
