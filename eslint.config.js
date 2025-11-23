module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'web-build/', '.expo/'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
