<template>
  <v-app
    v-if="initCompleted"
    id="gig-fm"
  >
    <AppBar />
    <NavDrawer />
    <v-main>
      <perfect-scrollbar ref="scroll">
        <router-view />
      </perfect-scrollbar>
      <v-snackbar
        v-model="alertShow"
        app
        top
        :color="alertColor"
        :timeout="5000"
      >
        {{ alertMessage }}
        <template #action="{ attrs }">
          <v-icon
            v-bind="attrs"
            @click="alertShow = false"
          >
            mdi-close
          </v-icon>
        </template>
      </v-snackbar>
      <v-dialog
        v-model="welcomeDialog"
        width="500"
      >
        <v-card>
          <v-card-title>
            Welcome to GigFM!
          </v-card-title>
          <v-card-actions>
            <v-checkbox
              v-model="dontShowAgain"
              label="Don't show again"
              hide-details
              class="do-not-show-checkbox"
            ></v-checkbox>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              tile
              depressed
              @click="closeWelcomeDialog"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import NavDrawer from '@C/NavDrawer.vue'
import AppBar from '@C/AppBar/index.vue'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    NavDrawer,
    AppBar
  },
  data: () => ({
    initCompleted: false,
    dontShowAgain: false,
    welcomeDialog: false
  }),
  computed: {
    ...mapState({
      alertMessage: state => state.alert.message,
      alertColor: state => state.alert.color
    }),
    alertShow: {
      get () {
        return this.$store.state.alert.show
      },
      set (value) {
        this.setAlertShow(value)
      }
    }
  },
  methods: {
    ...mapActions('repo', [
      'initRepos'
    ]),
    ...mapMutations({
      setAlertShow: 'alert/setShow'
    }),
    async initPreferences () {
      const preferences = await window.api.invoke('get-user-preferences')
      this.$vuetify.theme.dark = preferences.darkTheme
      this.welcomeDialog = preferences.showWelcome
    },
    async goToLastVisitedRoute () {
      const isNewUser = this.welcomeDialog  // If welcome dialog is opened, this is still a new user
      if (isNewUser) return  // If it's new user, stay at homepage so that user can read intro

      const fullPath = await window.api.invoke('get-appdata', 'last-visited-route')
      if (fullPath !== this.$route.fullPath) {
        this.$router.push(fullPath)
      }
    },
    closeWelcomeDialog () {
      if (this.dontShowAgain) {
        window.api.invoke('save-user-preferences', { showWelcome: false })
      }
      this.welcomeDialog = false
    }
  },
  async created () {
    this.initRepos()
      .then(() => {
        this.initCompleted = true
      })
      .catch(() => {
        alert('Bad luck! Something went wrong, please try again later.')
      })

    try {
      await this.initPreferences()
      await this.goToLastVisitedRoute()
    } catch (error) {
      console.error(error)
    }
  },
  watch: {
    $route() {
      this.$refs.scroll.$el.scrollTop = 0;
    }
  }
}
</script>

<style scoped>
.ps {
  height: calc(100vh - 30px);  /** 30px is app-bar's height */
}

.do-not-show-checkbox.v-input--selection-controls {
  margin-top: 0;
}
</style>

<style lang="scss">
@import 'vuetify/src/styles/styles.sass';

@include theme(v-btn) using ($material) {
  &:not(.v-btn--outlined) {
    &.primary,
    &.secondary,
    &.accent,
    &.success,
    &.error,
    &.warning,
    &.info {
      color: map-deep-get($material, 'text', 'button');
    }
  }
}

::-webkit-scrollbar {
  display: none;
}

.gig-clickable {
  cursor: pointer;
}

.gig-preserve-whitespace {
  white-space: pre-wrap;
}
</style>
