module.exports = {
  plugins: [
    'stylelint-scss'
  ],
  extends: 'stylelint-config-standard',
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  },
  ignoreFiles: ['**/*.(t|j)s', 'dist/**/*']
}
