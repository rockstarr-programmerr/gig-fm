<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    flat
    height="30"
    class="draggable"
  >
    <v-spacer></v-spacer>
    <WindowIcons />
  </v-app-bar>
</template>

<script>
import WindowIcons from './WindowIcons.vue'

export default {
  name: 'AppBar',
  components: {
    WindowIcons
  }
}
</script>

<style scoped>
.draggable {
  -webkit-app-region: drag
}
</style>
