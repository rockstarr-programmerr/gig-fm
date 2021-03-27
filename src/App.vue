<template>
  <v-app
    v-if="initCompleted"
    id="gig-fm"
  >
    <AppBar />
    <NavDrawer />
    <v-main>
      <perfect-scrollbar ref="scroll">
        <router-view/>
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
    initCompleted: false
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
    })
  },
  async created () {
    await this.initRepos()
    this.initCompleted = true
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
</style>

<style>
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
