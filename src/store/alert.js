export default {
  namespaced: true,
  state: () => ({
    message: '',
    color: 'success',
    show: false
  }),
  mutations: {
    setMessage (state, message) {
      state.message = message
    },
    setColor (state, color) {
      state.color = color
    },
    setShow (state, show) {
      state.show = show
    }
  },
  actions: {
    show ({ commit }, { message, color }) {
      commit('setColor', color)
      commit('setMessage', message)
      commit('setShow', true)
    },
    hide ({ commit }) {
      commit('setShow', false)
    },
    success ({ dispatch }, message) {
      dispatch('show', { message, color: 'success' })
    },
    error ({ dispatch }, message) {
      dispatch('show', { message, color: 'error' })
    }
  }
}
