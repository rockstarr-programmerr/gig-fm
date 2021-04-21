import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const opts = {
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: {
          base: '#ffa200',
          lighten1: '#ffb401',
          lighten2: '#ffc309',
          lighten3: '#ffcb29',
          lighten4: '#ffd650',
          lighten5: '#ffe183',
          lighten6: '#ffedb3',
          lighten7: '#fff8e1',
          darken1: '#ff9100',
          darken2: '#ff7100'
        },
        secondary: {
          base: '#ff2200'
        },
        anchor: '#ff2200',
        success: '#ffa200',
        error: '#ff2200',
      },
      dark: {
        primary: {
          base: '#ffe183'
        }
      }
    }
  }
}

export default new Vuetify(opts)
