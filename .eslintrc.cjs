/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },

  global: {
    module: true
  },
  rules: {
    // 命名规范
    'vue/multi-word-component-names': [
      'warn',
      {
        // 排除index
        ignores: ['index']
      }
    ]
  }
}
