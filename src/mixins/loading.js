export const loadingMixin = {
  data: () => ({
    loading: false
  }),
  methods: {
    'loading.start' () {
      this.loading = true
    },
    'loading.stop' () {
      this.loading = false
    }
  }
}
