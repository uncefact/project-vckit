// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
// Todo: replace all links by actual ones

import { themes as prismThemes } from 'prism-react-renderer';

const url = process.env.DOCS_URL || 'http://localhost';
const baseUrl = process.env.DOCS_BASE_URL || '/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'VCkit',
  tagline: 'UN/CEFACT Verifiable Credentials Toolkit',
  favicon: 'img/vckit-logo.svg',

  url,
  baseUrl,

  organizationName: 'uncefact', // Usually your GitHub org/user name.
  projectName: 'project-vckit', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/uncefact/project-vckit/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'VCkit',
        logo: {
          alt: 'VCkit Logo',
          src: 'img/vckit-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'getStartedSideBar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'docsVersionDropdown',
          },
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'documentSidebar',
          //   position: 'left',
          //   label: 'Agent Configuration',
          // },
          // {to: '/readme', label: 'README', position: 'left'},
          {
            href: 'https://github.com/uncefact/project-vckit',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/',
              },
            ],
          }
        ],
        copyright: `© United Nations Economic Commission for Europe`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
