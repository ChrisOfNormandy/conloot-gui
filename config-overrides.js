const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins.push(new MonacoWebpackPlugin({
        languages: [
            'bat',
            'markdown',
            'typescript',
            'shell',
            'json',
            'java',
            'javascript',
            'yaml',
            'xml'
        ]
    }));
    return config;
}