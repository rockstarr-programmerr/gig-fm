<template>
  <div class="non-draggable">
    <v-btn
      icon
      small
      class="ml-3"
      @click="minimizeWindow"
    >
      <v-icon>mdi-window-minimize</v-icon>
    </v-btn>
    <v-btn
      v-if="isMaximized"
      icon
      small
      class="ml-3"
      @click="unmaximizeWindow"
    >
      <v-icon>mdi-window-restore</v-icon>
    </v-btn>
    <v-btn
      v-else
      icon
      small
      class="ml-3"
      @click="maximizeWindow"
    >
      <v-icon>mdi-window-maximize</v-icon>
    </v-btn>
    <v-btn
      icon
      small
      class="ml-3"
      @click="closeWindow"
    >
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'WindowIcons',
  data: () => ({
    isMaximized: false
  }),
  methods: {
    closeWindow () {
      window.api.invoke('window-close')
    },
    minimizeWindow () {
      window.api.invoke('window-minimize')
    },
    maximizeWindow () {
      this.isMaximized = true
      window.api.invoke('window-maximize')
    },
    unmaximizeWindow () {
      this.isMaximized = false
      window.api.invoke('window-unmaximize')
    }
  },
  mounted () {
    window.api.receive('on-window-maximized', () => {
      this.isMaximized = true
    })
    window.api.receive('on-window-unmaximized', () => {
      this.isMaximized = false
    })
  }
}
</script>

<style scoped>
.non-draggable {
  -webkit-app-region: no-drag;
}
</style>
