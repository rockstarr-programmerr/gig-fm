<template>
  <v-container>
    <h1>Settings</h1>
    <v-divider></v-divider>
    <v-row align="center">
      <v-col cols="3">
        Dark theme
      </v-col>
      <v-col cols="9">
        <v-switch
          v-model="darkTheme"
        ></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Settings',
  computed: {
    darkTheme: {
      get () {
        return this.$vuetify.theme.dark
      },
      set (isDark) {
        this.$vuetify.theme.dark = isDark
      }
    }
  },
  watch: {
    darkTheme (isDark) {
      window.api.invoke('save-user-preferences', { darkTheme: isDark })
    }
  }
}
</script>

<style scoped>

</style>
