module.exports = {
    "parser": "babel-eslint",
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        'plugin:vue/recommended'
    ],
    "parser": "vue-eslint-parser",
    rules: {
        'no-console': 'off',
    },
    "parserOptions": {
        "parser": "babel-eslint",
        "sourceType": "module"
    }
};