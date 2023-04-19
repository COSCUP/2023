module.exports = {
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss"
  ],
  ignoreFiles: ['**/*.(t|j)s', 'dist/**/*'],
  rules: {
    'no-descending-specificity': null,
    'scss/comment-no-empty': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'scss/no-global-function-names': null,
    'selector-class-pattern': null,
    'scss/at-mixin-pattern': null,
    'scss/operator-no-unspaced': null,
    'custom-property-pattern': null,
    'scss/at-import-no-partial-leading-underscore': null
  },
}
