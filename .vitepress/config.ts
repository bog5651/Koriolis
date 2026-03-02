import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import path from 'path';
import { SitemapStream } from 'sitemap';
import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

const links: { url: string; lastmod?: number }[] = [];

export default defineConfig({
  title: 'Кориолис: Третий горизонт',
  description: 'Example',
  titleTemplate: false,
  srcDir: 'src',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Правила', link: '/rules/' }
    ],
    sidebar: {
      '/rules/': {
        base: '/rules/',
        items: [
          {
            text: 'Правила',
            items: [
              { text: 'Введение', link: 'introduction.md' },
              { text: 'Основы', link: 'index.md' }
            ]
          },
          {
            text: 'Основные правила',
            base: '/rules/core/',
            collapsed: false,
            items: [
              { text: 'Главная', link: 'index.md' },
              { text: 'Помощь', link: 'help' },
              { text: 'Боевая система', link: 'fight' },
              { text: 'Травмы и ранения', link: 'injuries' }
            ]
          },
          {
            text: 'Создание персонажа',
            base: '/rules/create/',
            collapsed: true,
            items: [
              { text: 'Главная', link: 'index' },
              { text: 'Воспитание', link: 'education' },
            ]
          },
          {
            text: 'Общие правила',
            base: '/rules/common/',
            collapsed: true,
            items: [
              { text: 'Главная', link: 'index' },
              { text: 'Лики покровителей', link: 'faces' },
              { text: 'Пункты Тьмы', link: 'points-of-darkness' },
              {
                text: 'Достоинства и способности',
                base: '/rules/common/advantages/',
                items: [
                  { text: 'Главная', link: 'index' },
                  { text: 'Дары Ликов', link: 'faces' },
                  { text: 'Достоинства команды', link: 'team' },
                  { text: 'Стигмы пасынков', link: 'stepsons' }
                ]
              }
            ]
          },
          {
            text: 'Предметы',
            base: '/rules/items/',
            collapsed: true,
            items: [
              { text: 'Главная', link: 'index.md' },
              { text: 'Амуниция и боеприпасы', link: 'ammo.md' },
              { text: 'Броня', link: 'armor.md' },
              { text: 'Разведка и шпионаж', link: 'assasin.md' },
              { text: 'Предметы повседневного обихода', link: 'commons.md' },
              { text: 'Медицинские технологии', link: 'heal.md' },
              { text: 'Запчасти и инструменты', link: 'parts.md' },
              { text: 'Средства передвижения и экзоскафандры', link: 'transport.md' },
              { text: 'Оружие', link: 'weapons.md' }
            ]
          },
        ]
      }
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    }
  },
  head: [
    ['link', { rel: 'manifest', href: 'site.webmanifest' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'image_src', type: 'image/png', href: '/images/social.png' }]
  ],
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
      });
  },
  vite: {
    plugins: [
      llmstxt(),
      {
        name: 'disable-vp-static-data-plugin',
        configResolved(config) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config.plugins.splice(
            config.plugins.findIndex((p) => p.name === 'vitepress:data'),
            1
          );
        }
      }
    ],
    resolve: {
      alias: [
        {
          find: /^.*\/VPFeature\.vue$/,
          replacement: path
            .resolve(__dirname, './theme/components/HHFeature.vue')
            .replaceAll(path.sep, '/')
          // fileURLToPath(
          //   new URL('./theme/components/HHFeature.vue', import.meta.url)
          // )
        }
      ]
    }
  }
});
