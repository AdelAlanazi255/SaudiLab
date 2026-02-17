// docusaurus.config.js
module.exports = {
  title: 'LearnHTML',
  tagline: 'Learn HTML step by step',
  url: 'http://localhost:3000',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'my-org',
  projectName: 'learn-html',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeConfigs: {
      en: { htmlLang: 'en' },
      ar: { htmlLang: 'ar', direction: 'rtl' },
    },
  },

  // ✅ add this: loads /static/js/custom.js in the browser
  scripts: [
  {
    src: '/js/custom.js',
    defer: false,
    async: false,
  },
  'https://cdn.moyasar.com/mpf/1.6.0/moyasar.js',
],

stylesheets: [
  'https://cdn.moyasar.com/mpf/1.6.0/moyasar.css',
],



  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: ' ', // MUST NOT be empty string
    },
  },
};
