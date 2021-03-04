module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },

  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  plugins: [
    'vue',
    '@typescript-eslint'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },

  root: true,

  extends: [
    'plugin:vue/essential',
    'standard'
  ]
}
