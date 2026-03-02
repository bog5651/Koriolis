// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-rational-order'
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {
    'selector-id-pattern': null,
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['/deep/', '/slotted/'] }],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['/deep/'] }],
    'value-keyword-case': ['lower', { ignoreFunctions: ['v-bind'] }],
    'number-max-precision': 6,
    'selector-class-pattern': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'media-feature-range-notation': null
  }
};
