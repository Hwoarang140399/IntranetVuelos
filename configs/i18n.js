module.exports = {
    locales: [
        {
          name: 'Español',
          code: 'es',
          iso: 'es-ES',
          file: 'es-ES/index.js'
        },
        {
          name: 'English',
          code: 'en',
          iso: 'en-US',
          file: 'en-US/index.js'
        }
      ],
      langDir: 'lang/',
      lazy: true,
      defaultLocale: 'en',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'lang',
        fallbackLocale: 'en'
      }
}