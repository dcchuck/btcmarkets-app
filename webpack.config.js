const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'index.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 3000
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'static' }
			]
		})
	]
}
