<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    flat
    height="30"
    class="draggable app-bar"
  >
    <v-img
      :src="require('@/assets/logo.png')"
      max-width="16"
      height="100%"
    ></v-img>
    <span class="ml-2">GigFM</span>
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

.app-bar ::v-deep .v-toolbar__content {
  padding-left: 4px;
}
</style>
