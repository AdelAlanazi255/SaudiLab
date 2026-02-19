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
  customFields: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  },

  // ✅ correct shape (object) — OR you can delete this whole markdown block
  markdown: {
    mdx1Compat: {
      // keep MDX2 behavior (no MDX1 "loose" parsing)
      comments: false,
      admonitions: false,
      headingIds: false,
    },
  },

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
  ],

  stylesheets: [],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
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
