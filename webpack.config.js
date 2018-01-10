const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: 'index.js'
    }
}