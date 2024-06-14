/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  // ESLint 默认解析器，也可以指定成别的
  env: {
    node: true
  },
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 2015
  },

  // global: {
  //   module: true
  // },
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
