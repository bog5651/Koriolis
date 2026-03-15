import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import path from 'path';
import { SitemapStream } from 'sitemap';
import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

const links: { url: string; lastmod?: number }[] = [];

export default defineConfig({
  title: 'Кориолис: Третий горизонт',
  description: 'Кориолис: Третий Горизонт — полный справочник правил настольной ролевой игры «Кориолис». Онлайн справочник по основным правилам, боевая система, травмы, опыт, снаряжение, создание персонажа, достоинства, амплуа и предметы.',
  titleTemplate: false,
  srcDir: 'src',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Правила', link: '/rules/' },
      { text: 'Предметы', link: '/items/' },
      { text: 'Амплуа', link: '/classes/' },
      { text: 'Корабли', link: '/ships/intro' },
      { text: 'Утилиты', link: '/utils/' }
    ],
    sidebar: {
      '/rules/': {
        base: '/rules/',
        items: [
          {
            text: 'Введение',
            link: 'index.md',
          },
          {
            text: 'Основные правила',
            base: '/rules/core/',
            collapsed: false,
            items: [
              { text: 'Помощь', link: 'help' },
              { text: 'Травмы и ранения', link: 'injuries' },
              { text: 'Опыт', link: 'exp' },
              { text: 'Действия', link: 'actions' },
              { text: 'Снаряжение и Грузоподъёмность', link: 'load' },
              { text: 'Молитвы', link: 'prayers' },
              { text: 'Навыки', link: 'skills' },
            ]
          },
          {
            text: 'Боевая система',
            base: '/rules/fight/',
            collapsed: false,
            items:[
              { text: 'Инициатива', link: 'initiative' },
              { text: 'Ближний Бой', link: 'melee-fight' },
              { text: 'Дальний Бой', link: 'range-fight' },
              { text: 'Укрытия', link: 'shelter' },
              { text: 'Транспортный Бой', link: 'transport' }
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
                link: 'index',
                items: [
                  { text: 'Дары Ликов', link: 'faces' },
                  { text: 'Личные Достоинства', link: 'personal' },
                  { text: 'Достоинства команды', link: 'team' },
                  { text: 'Импланты и модификации', link: 'impl' },
                  { text: 'Мистические Практики', link: 'mistic' },
                  { text: 'Стигмы пасынков', link: 'stepsons' }
                ]
              }
            ]
          },
        ]
      },
      '/items': {
        base: '/items/',
        items: [
          {
            text: 'Предметы',
            base: '/items/',
            collapsed: false,
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
      },
      '/classes': {
        base: '/classes',
        items: [
          {
            text: 'Амплуа',
            base: '/classes/',
            link: 'index.md',
            collapsed: false,
            items: [
              { text: 'Артист', link: 'artist.md' },
              { text: 'Сетевой Паук', link: 'spider.md' },
              { text: 'Беглец', link: 'fugitive.md' },
              { text: 'Негоциант', link: 'merchant.md' },
              { text: 'Оперативник', link: 'operative.md' },
              { text: 'Пилот', link: 'pilot.md' },
              { text: 'Проповедник', link: 'preacher.md' },
              { text: 'Учёный', link: 'scientist.md' },
              { text: 'Матрос', link: 'sailor.md' },
              { text: 'Солдат', link: 'soldier.md' },
              { text: 'Первопроходец', link: 'trailblazer.md' },
            ]
          },
        ]
      },
      '/utils': {
        base: '/utils/',
        items: [
          {
            text: 'Утилиты',
            items: [
              { text: 'Генератор', link: 'names' },
            ]
          }
        ]
      },
      '/ships': {
        base: '/ships/',
        items: [
          {
            text: 'Корабли',
            items: [
              { text: 'Введение', link: 'intro' },
              { text: 'Создание Корабля', link: 'create' },
              { text: 'Корабли', link: 'ships' },
              { text: 'Модули', link: 'modules' },
              { text: 'Усовершенствования', link: 'improvements' },
              { text: 'Тех. обслуживание', link: 'maintenance' },
              { text: 'Сражения', link: 'fight' },
            ]
          }
        ]
      }
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },
    footer: {
      message: 'Все права на Кориолис принадлежат Paradox Interactive AB.',
      copyright: '© 2025 — Сайт-справочник не является официальным продуктом Paradox Interactive.'
    },
  },
  head: [
    ['meta', { name: 'google-site-verification', content: 'jNJQ_vm2rpm8qHFFyI2znNBamd5frJpM3kOdeC2p9e8' }],
    ['meta', { name: 'yandex-verification', content: 'ea11a8e3b81b87ad' }],
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
        }
      ]
    }
  }
});
