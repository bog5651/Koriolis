// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';

import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import CoinAnimation from './components/CoinAnimation.vue';
import HHFeature from './components/HHFeature.vue';

import './styles/index.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image':() => h(CoinAnimation)
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app }) {
    app.component('HHFeature', HHFeature)
  }

  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // }
} satisfies Theme;
