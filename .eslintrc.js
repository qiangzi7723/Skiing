// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    extends: 'airbnb-base',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // check if imports actually resolve
    'settings': {
        'import/resolver': {
            'webpack': {
                'config': 'build/webpack.base.conf.js'
            }
        }
    },
    // add your custom rules here
    'rules': {
        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            'js': 'never',
            'vue': 'never'
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            'optionalDependencies': ['test/unit/index.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        // 自定义的配置写在这里
        "indent": [2, "tab"], // 缩进配置
        "no-tabs": 0, // 缩进配置
        "no-unused-vars": 0, // 取消存在未使用的变量时的报错
        "no-console": 0, // 取消使用console时的报错
    },

    // 手动声明的全局变量 这样在全局引入的变量不会被检测为undefined类型
    "globals": {
        "wx": 0,
        "$": 0,
    },
}
