// docusaurus.config.js
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const webpack = require('webpack');

function supabaseEnvPlugin() {
  return {
    name: 'supabase-env-injection',
    configureWebpack() {
      return {
        plugins: [
          new webpack.DefinePlugin({
            'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL || ''),
            'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY || ''),
          }),
        ],
      };
    },
  };
}
module.exports = {
  title: 'SaudiLab',
  tagline: 'Gateway to learning Coding and Cyber Security',
  url: 'http://localhost:3000',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',

  organizationName: 'my-org',
  projectName: 'learn-html',
  customFields: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
  },

  markdown: {
    mdx1Compat: {
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
    { src: '/_vercel/insights/script.js', defer: true },
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
    supabaseEnvPlugin,
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'css',
        path: 'docs/css',
        routeBasePath: 'css',
        sidebarPath: require.resolve('./sidebarsCss.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'javascript',
        path: 'docs/javascript',
        routeBasePath: 'javascript',
        sidebarPath: require.resolve('./sidebarsJavascript.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'cse',
        path: 'docs/cse',
        routeBasePath: 'cse',
        sidebarPath: require.resolve('./sidebarsCse.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'crypto',
        path: 'docs/crypto',
        routeBasePath: 'cryptography',
        sidebarPath: require.resolve('./sidebarsCrypto.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'websecurity',
        path: 'docs/web-security',
        routeBasePath: 'web-security',
        sidebarPath: require.resolve('./sidebarsWebSecurity.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'networkbasics',
        path: 'docs/network-basics',
        routeBasePath: 'network-basics',
        sidebarPath: require.resolve('./sidebarsNetworkBasics.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'pcs',
        path: 'docs/pcs',
        routeBasePath: 'pcs',
        sidebarPath: require.resolve('./sidebarsPcs.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ethics',
        path: 'docs/ethics',
        routeBasePath: 'ethics',
        sidebarPath: require.resolve('./sidebarsEthics.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'kalitools',
        path: 'docs/kali-tools',
        routeBasePath: 'kali',
        sidebarPath: require.resolve('./sidebarsKaliTools.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'forensics',
        path: 'docs/forensics',
        routeBasePath: 'forensics',
        sidebarPath: require.resolve('./sidebarsForensics.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blueteam',
        path: 'docs/blueteam',
        routeBasePath: 'blueteam',
        sidebarPath: require.resolve('./sidebarsBlueteam.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'career',
        path: 'docs/career',
        routeBasePath: 'career',
        sidebarPath: require.resolve('./sidebarsCareer.js'),
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

