<template>
  <v-navigation-drawer
    app
    clipped
    right
    permanent
    :mini-variant.sync="mini"
  >
    <div
      class="px-4 py-3 settings-icon-div"
      :class="mini ? 'rotate' : 'no-rotate'"
    >
      <v-icon
        @click="mini = !mini"
        class="settings-icon"
      >
        mdi-settings-outline
      </v-icon>
    </div>
    <v-scroll-x-transition>
      <div v-show="!mini">
        <div class="px-4 py-3">
          Repo settings
        </div>
        <div class="px-4 py-3">
          <v-form ref="repoSettingsForm">
            <v-text-field
              v-model="repoName"
              label="Repo name"
              dense
            ></v-text-field>
            <v-text-field
              v-model="authorName"
              label="Your name"
              dense
            ></v-text-field>
            <v-text-field
              v-model="authorEmail"
              label="Your email"
              dense
            ></v-text-field>
          </v-form>
        </div>
        <div class="px-4 text-right">
          <v-btn
            color="primary"
            tile
            depressed
          >
            Save
          </v-btn>
        </div>
      </div>
    </v-scroll-x-transition>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'RepoSettings',
  data: () => ({
    mini: true,
    repoName: '',
    authorName: '',
    authorEmail: ''
  })
}
</script>

<style scoped>
.settings-icon-div {
  position: absolute;
  top: 0;
  right: 0;
  transition-property: transform;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.rotate {
  transform: rotate(180deg);
}

.no-rotate {
  transform: rotate(0deg);
}
</style>
