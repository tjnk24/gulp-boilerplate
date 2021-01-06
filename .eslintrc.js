module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    indent: ['error', 2],
    'no-unused-vars': 'warn',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
  },
};
