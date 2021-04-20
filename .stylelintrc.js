module.exports = {
  plugins: [
    'stylelint-scss'
  ],
  extends: 'stylelint-config-standard',
  rules: {
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  },
  ignoreFiles: ['**/*.(t|j)s', 'dist/**/*']
}
