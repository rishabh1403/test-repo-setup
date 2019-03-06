const eslintRules = {
  extends: ['airbnb', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  env: {
    browser: true,
    jest: true,
  },
  parser: 'babel-eslint',
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'prettier/prettier': 0,
    'no-console': 0,
  },
};

module.exports = eslintRules;
