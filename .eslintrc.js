module.exports = {
   env: {
      commonjs: true,
      es2021: true,
      node: true,
   },
   extends: ['airbnb-base'],
   parserOptions: {
      ecmaVersion: 'latest',
   },
   rules: {
      indent: ['error', 3],
      'class-methods-use-this': 'off',
      'no-unused-vars': 'warn',
      camelcase: 'off',
      'max-len': 'off',
   },
};
