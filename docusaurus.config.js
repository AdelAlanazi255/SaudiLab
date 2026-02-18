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

  scripts: [
    { src: '/js/custom.js', defer: false, async: false },
    'https://cdn.moyasar.com/mpf/1.6.0/moyasar.js',
  ],

  stylesheets: ['https://cdn.moyasar.com/mpf/1.6.0/moyasar.css'],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // ✅ HTML docs live at /html/*
          path: 'docs/html',
          routeBasePath: 'html',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  // ✅ second docs plugin instance for CSS at /css/*
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'css',
        path: 'docs/css',
        routeBasePath: 'css',
        sidebarPath: require.resolve('./sidebarsCss.js'),
      },
    ],
  ],

  themeConfig: {
    navbar: {
      items: [{ type: 'localeDropdown', position: 'right' }],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: ' ',
    },
  },
};
