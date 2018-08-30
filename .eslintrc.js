// http://eslint.org/docs/user-guide/configuring

module.exports = {
    extends: 'standard',
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        node: true,
        browser: false,
    },
    rules: {
        "camelcase": [0],
        "files": ["src/*.js"],
        "semi": [2, "always"],
        "indent": [2, 4],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
};
