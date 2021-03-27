<template>
  <v-app v-if="initCompleted" id="gig-fm">
    <NavDrawer />
    <v-main>
      <router-view/>
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
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    NavDrawer
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
  }
}
</script>

<style scoped>

</style>

<style>
.gig-clickable {
  cursor: pointer;
}

.gig-preserve-whitespace {
  white-space: pre-wrap;
}
</style>
