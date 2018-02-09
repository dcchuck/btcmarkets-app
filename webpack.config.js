const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'public', 'js'),
		filename: 'index.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 3000
	}
}
