import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const isVercel = process.env.VERCEL === '1';

const config: Config = {
  title: 'PostHog 中文指南',
  tagline: '开源产品分析平台',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: isVercel 
    ? 'https://posthog-guide.vercel.app'  // Vercel URL
    : 'https://pama-lee.github.io',        // GitHub Pages URL

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: isVercel ? '/' : '/posthog-guide/',

  // GitHub pages deployment config.
  organizationName: 'Pama-Lee',
  projectName: 'posthog-guide',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },
  // themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/Pama-Lee/posthog-guide/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/Pama-Lee/posthog-guide/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'PostHog 中文指南',
      logo: {
        alt: 'PostHog Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {to: '/blog', label: '博客', position: 'left'},
        {
          href: 'https://github.com/Pama-Lee/posthog-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '教程',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Pama-Lee/posthog-guide',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PostHog 中文指南`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'bash',
        'diff',
        'json',
        'json5',
        'yaml',
        'markdown',
        'python',
        'jsx',
        'tsx',
        'typescript',
        'docker',
        'nginx',
        'sql',
        'properties',
        'toml',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
