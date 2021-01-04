module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    indent: ['error', 2],
  },
};
