const pkg = require('./package');
const I18N = require('./configs/i18n');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Travelmax Intranet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?' }
    ]
  },
  /*
  ** Env variables
  */
  env:{
    baseUrl: 'http://192.168.1.1:3000'
  },

  router: {
    middleware: 'first'
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '@mdi/font/css/materialdesignicons.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/vue-socketio.js', ssr:false},
    {src: '~/plugins/moment.js', ssr:false},
    {src: '~/plugins/datepicker.js', ssr:false}
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    'bootstrap-vue/nuxt',
    'vue-sweetalert2/nuxt',
    ['nuxt-i18n', I18N]
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // config.output.globalObject = 'this'
    }
  }
}
