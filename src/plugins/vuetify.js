import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
    theme: {
        themes: {
          light: {
            primary: colors.indigo.accent2,
            secondary: colors.grey.darken1,
            accent: colors.shades.black,
            error: colors.red.lighten1,
            success: colors.green.lighten1,
          },
          dark: {
            primary: colors.blue.lighten3,
          },
        },
      },
});
