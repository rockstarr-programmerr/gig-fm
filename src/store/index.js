import Vue from 'vue'
import Vuex from 'vuex'
import repo from './repo.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    repo
  }
})
