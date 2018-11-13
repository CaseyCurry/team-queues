module.exports = {
  "env": {
    "node": true,
    "es6": true,
    "mocha": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "plugins": [],
  "rules": {
    "indent": ["error",
      2, {
        "SwitchCase": 1
      }
    ],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-console": "off",
    "no-underscore-dangle": "error"
  }
};