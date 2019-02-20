const eslintRules = {
  extends: ['airbnb', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'prettier/prettier': 0,
    'no-console': 1,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
};

module.exports = eslintRules;
